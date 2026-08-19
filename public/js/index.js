/* Scroll-linked product reveal and 360-degree orbit for Lancelot. */
(function () {
  const story = document.querySelector('.robot-story');
  const stage = document.querySelector('.robot-stage');
  const hero = document.getElementById('hero-copy');
  const viewer = document.querySelector('.robot-viewer-wrap');
  const number = document.querySelector('.robot-number');
  const model = document.getElementById('lancelot-model');
  const progressBar = document.getElementById('robot-progress-bar');
  const status = document.getElementById('model-status');
  const callouts = [...document.querySelectorAll('[data-robot-callout]')];
  const closing = document.querySelector('.closing-photo');
  const closingImage = document.getElementById('closing-image');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!story || !stage || !hero || !viewer || !model || !progressBar) return;

  let storyVisible = true;
  let closingVisible = false;
  let frame = 0;
  let activeCallout = 0;
  let lastOrbit = Number.NaN;
  let focusFrame = 0;
  let focusMaterials = [];
  let reducedStateApplied = false;
  const focusBaseline = new Map();

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const easeOut = (value) => 1 - Math.pow(1 - value, 3);

  function prepareFocusMaterials() {
    focusBaseline.clear();
    focusMaterials = [...(model.model?.materials || [])].filter((material) =>
      /^focus\.(Chassis|Intake|Shooter|Indexer|Other)\./.test(material.name)
    );
    focusMaterials.forEach((material) => {
      focusBaseline.set(material, {
        rgba: [...material.pbrMetallicRoughness.baseColorFactor],
        mode: material.getAlphaMode(),
      });
    });
  }

  function restoreModelFocus() {
    window.cancelAnimationFrame(focusFrame);
    focusMaterials.forEach((material) => {
      const saved = focusBaseline.get(material);
      if (!saved) return;
      material.setAlphaMode(saved.mode);
      material.pbrMetallicRoughness.setBaseColorFactor(saved.rgba);
    });
  }

  function setModelFocus(group, animate = true) {
    if (!focusMaterials.length) return;

    window.cancelAnimationFrame(focusFrame);
    const starts = new Map(focusMaterials.map((material) => [
      material,
      material.pbrMetallicRoughness.baseColorFactor[3],
    ]));

    focusMaterials.forEach((material) => {
      const selected = !group || material.name.startsWith(`focus.${group}.`);
      if (!selected) material.setAlphaMode('BLEND');
    });

    const paint = (progress) => focusMaterials.forEach((material) => {
      const saved = focusBaseline.get(material);
      if (!saved) return;
      const selected = !group || material.name.startsWith(`focus.${group}.`);
      const target = selected ? saved.rgba[3] : Math.min(saved.rgba[3], 0.3);
      const alpha = starts.get(material) + (target - starts.get(material)) * easeOut(progress);
      material.pbrMetallicRoughness.setBaseColorFactor([
        saved.rgba[0], saved.rgba[1], saved.rgba[2],
        alpha,
      ]);
      if (progress === 1 && selected) material.setAlphaMode(saved.mode);
    });

    if (!animate) {
      paint(1);
      return;
    }

    const startedAt = performance.now();
    const tick = (now) => {
      const progress = clamp((now - startedAt) / 190);
      paint(progress);
      if (progress < 1) focusFrame = window.requestAnimationFrame(tick);
    };
    focusFrame = window.requestAnimationFrame(tick);
  }

  function showCallout(index) {
    if (index === activeCallout) return;
    callouts[activeCallout]?.classList.remove('is-active');
    activeCallout = index;
    if (index < 0) {
      stage.dataset.focus = 'full';
      setModelFocus(null);
      return;
    }
    callouts[index]?.classList.add('is-active');
    stage.dataset.focus = 'part';
    setModelFocus(callouts[index]?.dataset.robotGroup);
  }

  function showLoadedState() {
    viewer.classList.add('is-loaded');
    if (status) status.textContent = '3D robot ready';
  }

  function showReducedMotionState() {
    hero.style.opacity = '1';
    hero.style.transform = 'none';
    viewer.style.opacity = '1';
    viewer.style.transform = 'none';
    viewer.style.pointerEvents = 'auto';
    if (number) {
      number.style.opacity = '0.75';
      number.style.transform = 'translate(-50%, -50%)';
    }
    model.cameraOrbit = '-20deg 72deg 105%';
    model.jumpCameraToGoal();
    if (!reducedStateApplied) {
      restoreModelFocus();
      reducedStateApplied = true;
    }
  }

  function update() {
    frame = 0;
    if (!storyVisible && !closingVisible) return;

    if (storyVisible) {
      const rect = story.getBoundingClientRect();
      const travel = Math.max(1, story.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / travel);

      progressBar.style.transform = `scaleX(${progress})`;

      if (reduceMotion.matches) {
        showReducedMotionState();
      } else {
        reducedStateApplied = false;
        const reveal = easeOut(clamp(progress / 0.24));
        const orbit = clamp((progress - 0.16) / 0.84);

        hero.style.opacity = String(1 - reveal);
        hero.style.transform = `translate(-50%, calc(-50% - ${reveal * 10}vh)) scale(${1 - reveal * 0.05})`;
        hero.style.pointerEvents = reveal > 0.55 ? 'none' : '';

        viewer.style.opacity = String(reveal);
        viewer.style.transform = `translateY(${(1 - reveal) * 18}vh) scale(${0.78 + reveal * 0.22})`;
        viewer.style.pointerEvents = reveal > 0.55 ? 'auto' : 'none';

        if (number) {
          number.style.opacity = String(0.92 - reveal * 0.42);
          number.style.transform = `translate(-50%, -50%) scale(${1 + reveal * 0.08})`;
        }

        const orbitAngle = orbit * 360 - 20;
        if (!Number.isFinite(lastOrbit) || Math.abs(orbitAngle - lastOrbit) >= 0.2) {
          model.cameraOrbit = `${orbitAngle}deg 72deg 105%`;
          model.jumpCameraToGoal();
          lastOrbit = orbitAngle;
        }
        showCallout(orbit >= 0.86
          ? -1
          : Math.min(callouts.length - 1, Math.floor((orbit / 0.86) * callouts.length)));
        stage.dataset.phase = reveal > 0.5 ? 'robot' : 'hero';
      }
    }

    if (closingVisible && closingImage) {
      if (reduceMotion.matches) {
        closingImage.style.transform = 'none';
      } else {
        const rect = closing.getBoundingClientRect();
        const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
        closingImage.style.transform = `translateY(${(0.5 - progress) * 5}%) scale(1.06)`;
      }
    }
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  customElements.whenDefined('model-viewer').then(() => {
    customElements.get('model-viewer').minimumRenderScale = 0.25;
    const finishModelLoad = () => {
      prepareFocusMaterials();
      if (reduceMotion.matches) {
        restoreModelFocus();
        reducedStateApplied = true;
      }
      else setModelFocus(callouts[activeCallout]?.dataset.robotGroup, false);
      showLoadedState();
    };

    model.addEventListener('load', finishModelLoad);
    model.addEventListener('error', () => {
      viewer.classList.add('has-error');
      if (status) status.textContent = 'Showing the robot photo';
    });

    if (model.loaded) finishModelLoad();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === story) storyVisible = entry.isIntersecting;
        if (entry.target === closing) closingVisible = entry.isIntersecting;
      });
      if (storyVisible || closingVisible) schedule();
    }, { rootMargin: '100% 0px' });

    observer.observe(story);
    if (closing) observer.observe(closing);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    reduceMotion.addEventListener('change', (event) => {
      reducedStateApplied = false;
      if (!event.matches) setModelFocus(callouts[activeCallout]?.dataset.robotGroup, false);
      schedule();
    });
    schedule();
  });
})();
