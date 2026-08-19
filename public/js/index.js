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
  const componentCallouts = callouts.filter((callout) => callout.dataset.robotGroup !== 'Full');
  const closing = document.querySelector('.closing-photo');
  const closingImage = document.getElementById('closing-image');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!story || !stage || !hero || !viewer || !model || !progressBar) return;

  let storyVisible = true;
  let closingVisible = false;
  let frame = 0;
  let activeCallout = 0;
  let lastOrbit = Number.NaN;
  let focusMaterials = [];
  let reducedStateApplied = false;
  const focusBaseline = new Map();
  const intakeMechanismNames = new Set([
    'focus.Intake.m01',
    'focus.Intake.m02',
    'focus.Intake.m04',
    'focus.Intake.m05',
  ]);

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
        metallic: material.pbrMetallicRoughness.metallicFactor,
        roughness: material.pbrMetallicRoughness.roughnessFactor,
        emissive: [...material.emissiveFactor],
        mode: material.getAlphaMode(),
        currentMode: material.getAlphaMode(),
        currentVisualLevel: Number.NaN,
        currentInspection: Number.NaN,
        group: material.name.match(/^focus\.([^.]+)\./)?.[1],
        isIntakeMechanism: intakeMechanismNames.has(material.name),
        isIntakePulleySet: material.name === 'focus.Intake.m01',
      });
    });
  }

  function restoreModelFocus() {
    focusMaterials.forEach((material) => {
      const saved = focusBaseline.get(material);
      if (!saved) return;
      material.setAlphaMode(saved.mode);
      saved.currentMode = saved.mode;
      saved.currentVisualLevel = Number.NaN;
      saved.currentInspection = Number.NaN;
      material.pbrMetallicRoughness.setBaseColorFactor(saved.rgba);
      material.pbrMetallicRoughness.setMetallicFactor(saved.metallic);
      material.pbrMetallicRoughness.setRoughnessFactor(saved.roughness);
      material.setEmissiveFactor(saved.emissive);
    });
  }

  function applyFocusLevels(levels, force = false) {
    if (!focusMaterials.length) return;
    focusMaterials.forEach((material) => {
      const saved = focusBaseline.get(material);
      if (!saved) return;
      const level = clamp(levels[saved.group] || 0);
      const intakeClearance = saved.group === 'Intake' ? 0 : clamp(levels.Intake || 0);
      const intakeGhost = saved.group === 'Chassis' ? 0.24 : 0.16;
      const ghostCeiling = 0.34 + (intakeGhost - 0.34) * intakeClearance;
      const ghostAlpha = Math.min(saved.rgba[3], ghostCeiling);
      const alpha = ghostAlpha + (saved.rgba[3] - ghostAlpha) * level;
      const visualLevel = level;
      const intakeInspection = saved.isIntakeMechanism ? clamp(levels.IntakeInspection || 0) : 0;
      const currentAlpha = material.pbrMetallicRoughness.baseColorFactor[3];
      if (!force
        && Math.abs(currentAlpha - alpha) < 0.003
        && Math.abs(saved.currentVisualLevel - visualLevel) < 0.003
        && Math.abs(saved.currentInspection - intakeInspection) < 0.003) return;
      saved.currentVisualLevel = visualLevel;
      saved.currentInspection = intakeInspection;

      const targetMode = saved.isIntakePulleySet && intakeInspection > 0
        ? 'OPAQUE'
        : alpha >= saved.rgba[3] - 0.003 ? saved.mode : 'BLEND';
      if (saved.currentMode !== targetMode) {
        material.setAlphaMode(targetMode);
        saved.currentMode = targetMode;
      }
      const luminance = saved.rgba[0] * 0.2126 + saved.rgba[1] * 0.7152 + saved.rgba[2] * 0.0722;
      const shell = Math.max(0.045, luminance * 0.58);
      const inspectionLift = (saved.isIntakePulleySet ? 0 : 0.16) * intakeInspection;
      const baseColor = [
        shell * (1 - visualLevel) + saved.rgba[0] * visualLevel,
        shell * 1.03 * (1 - visualLevel) + saved.rgba[1] * visualLevel,
        shell * 1.1 * (1 - visualLevel) + saved.rgba[2] * visualLevel,
      ];
      const pulleyColor = [0.4, 0.42, 0.46];
      const pulleyMix = saved.isIntakePulleySet ? intakeInspection : 0;
      material.pbrMetallicRoughness.setBaseColorFactor([
        (baseColor[0] + (1 - baseColor[0]) * inspectionLift) * (1 - pulleyMix) + pulleyColor[0] * pulleyMix,
        (baseColor[1] + (1 - baseColor[1]) * inspectionLift) * (1 - pulleyMix) + pulleyColor[1] * pulleyMix,
        (baseColor[2] + (1 - baseColor[2]) * inspectionLift) * (1 - pulleyMix) + pulleyColor[2] * pulleyMix,
        alpha,
      ]);
      material.pbrMetallicRoughness.setMetallicFactor(saved.metallic + (0.62 - saved.metallic) * pulleyMix);
      material.pbrMetallicRoughness.setRoughnessFactor(saved.roughness + (0.34 - saved.roughness) * pulleyMix);
      const pulleyEmissive = [0.018, 0.02, 0.026];
      material.setEmissiveFactor([
        (Math.max(saved.emissive[0], 0.016 + 0.018 * intakeInspection) * (1 - visualLevel) + Math.max(saved.emissive[0], 0.028 * intakeInspection) * visualLevel) * (1 - pulleyMix) + pulleyEmissive[0] * pulleyMix,
        (Math.max(saved.emissive[1], 0.018 + 0.02 * intakeInspection) * (1 - visualLevel) + Math.max(saved.emissive[1], 0.032 * intakeInspection) * visualLevel) * (1 - pulleyMix) + pulleyEmissive[1] * pulleyMix,
        (Math.max(saved.emissive[2], 0.024 + 0.022 * intakeInspection) * (1 - visualLevel) + Math.max(saved.emissive[2], 0.04 * intakeInspection) * visualLevel) * (1 - pulleyMix) + pulleyEmissive[2] * pulleyMix,
      ]);
    });
  }

  function setModelFocus(group) {
    const levels = { Chassis: 0, Intake: 0, Shooter: 0, Indexer: 0, Other: 0 };
    if (group && group !== 'Full') levels[group] = 1;
    else Object.keys(levels).forEach((key) => { levels[key] = 1; });
    applyFocusLevels(levels, true);
  }

  function scrubModelFocus(breakdownProgress, intakeInspectionReveal = 1) {
    if (!focusMaterials.length) return;
    const groups = ['Intake', 'Indexer', 'Shooter', 'Chassis'];
    const levels = { Chassis: 0, Intake: 0, Shooter: 0, Indexer: 0, Other: 0 };

    if (breakdownProgress < 0.12) {
      const rawMix = clamp(breakdownProgress / 0.12);
      const mix = rawMix * rawMix * (3 - 2 * rawMix);
      Object.keys(levels).forEach((group) => { levels[group] = 1 - mix; });
      levels.Intake = 1;
      levels.IntakeInspection = intakeInspectionReveal;
      applyFocusLevels(levels);
      return;
    }

    const orbit = clamp((breakdownProgress - 0.12) / 0.88);

    if (orbit >= 0.86) {
      const rawMix = clamp((orbit - 0.86) / 0.1);
      const fullMix = rawMix * rawMix * (3 - 2 * rawMix);
      groups.forEach((group) => { levels[group] = fullMix; });
      levels.Chassis = 1;
      levels.Other = fullMix;
      levels.IntakeInspection = 0;
    } else {
      const scaled = (orbit / 0.86) * groups.length;
      const index = Math.min(groups.length - 1, Math.floor(scaled));
      const local = scaled - index;
      levels[groups[index]] = 1;

      if (index < groups.length - 1) {
        const rawMix = clamp((local - 0.68) / 0.32);
        const mix = rawMix * rawMix * (3 - 2 * rawMix);
        levels[groups[index]] = 1 - mix;
        levels[groups[index + 1]] = mix;
      }
      levels.IntakeInspection = levels.Intake;
    }
    applyFocusLevels(levels);
  }

  function showCallout(index) {
    if (index === activeCallout) return;
    callouts[activeCallout]?.classList.remove('is-active');
    activeCallout = index;
    if (index < 0) {
      stage.dataset.focus = 'full';
      return;
    }
    callouts[index]?.classList.add('is-active');
    stage.dataset.focus = 'part';
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
      number.style.setProperty('--final-glow', '0');
      number.style.opacity = '0.75';
      number.style.transform = 'translate(-50%, -50%)';
    }
    model.cameraOrbit = '-20deg 72deg 98%';
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
        const sequence = clamp((progress - 0.16) / 0.84);
        const breakdown = sequence < 0.5 ? 0 : (sequence - 0.5) / 0.5;
        const focusOrbit = clamp((breakdown - 0.12) / 0.88);
        const rawFinalGlow = sequence < 0.5 ? 0 : clamp((focusOrbit - 0.86) / 0.14);
        const finalGlow = rawFinalGlow * rawFinalGlow * (3 - 2 * rawFinalGlow);
        stage.dataset.final = finalGlow > 0 ? 'true' : 'false';

        hero.style.opacity = String(1 - reveal);
        hero.style.transform = `translate(-50%, calc(-50% - ${reveal * 10}vh)) scale(${1 - reveal * 0.05})`;
        hero.style.pointerEvents = reveal > 0.55 ? 'none' : '';

        viewer.style.opacity = String(reveal);
        viewer.style.transform = `translateY(${(1 - reveal) * 18}vh) scale(${0.78 + reveal * 0.22})`;
        viewer.style.pointerEvents = reveal > 0.55 ? 'auto' : 'none';

        if (number) {
          number.style.setProperty('--final-glow', String(finalGlow));
          number.style.opacity = String(0.92 - reveal * 0.42 + finalGlow * 0.34);
          number.style.transform = `translate(-50%, -50%) scale(${1 + reveal * 0.08 + finalGlow * 0.035})`;
        }

        const orbitAngle = sequence * 720 - 20;
        if (!Number.isFinite(lastOrbit) || Math.abs(orbitAngle - lastOrbit) >= 0.2) {
          model.cameraOrbit = `${orbitAngle}deg 72deg 98%`;
          model.jumpCameraToGoal();
          lastOrbit = orbitAngle;
        }
        if (sequence < 0.5) {
          const inspectionReveal = clamp((sequence - 0.4) / 0.1);
          const smoothInspectionReveal = inspectionReveal * inspectionReveal * (3 - 2 * inspectionReveal);
          showCallout(0);
          scrubModelFocus(0, smoothInspectionReveal);
        } else {
          showCallout(focusOrbit >= 0.86
            ? -1
            : 1 + Math.min(componentCallouts.length - 1, Math.floor((focusOrbit / 0.86) * componentCallouts.length)));
          scrubModelFocus(breakdown);
        }
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
      else setModelFocus(callouts[activeCallout]?.dataset.robotGroup);
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
      if (!event.matches) setModelFocus(callouts[activeCallout]?.dataset.robotGroup);
      schedule();
    });
    schedule();
  });
})();
