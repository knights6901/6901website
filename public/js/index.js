/* Scroll-controlled Lancelot product story. One orbit, four inspection beats, full assembly finish. */
(function () {
  const story = document.querySelector('.robot-story');
  const stage = document.querySelector('.robot-stage');
  const hero = document.getElementById('hero-copy');
  const viewer = document.querySelector('.robot-viewer-wrap');
  const number = document.querySelector('.robot-number');
  const model = document.getElementById('lancelot-model');
  const progressBar = document.getElementById('robot-progress-bar');
  const status = document.getElementById('model-status');
  const loader = document.getElementById('site-loader');
  const callouts = [...document.querySelectorAll('[data-robot-callout]')];
  const closing = document.querySelector('.closing-photo');
  const closingImage = document.getElementById('closing-image');
  const joinWorktable = document.querySelector('.join-worktable');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileLayout = window.matchMedia('(max-width: 760px), (max-width: 1080px) and (orientation: portrait)');

  if (!story || !stage || !hero || !viewer || !model || !progressBar) return;

  const groups = ['Intake', 'Indexer', 'Shooter', 'Chassis'];
  const storyBeats = {
    overviewEnd: 0.32,
    inspectionEnd: 0.92,
    chassisStart: 0.69,
    chassisSpinEnd: 0.86,
    chassisHoldEnd: 0.93,
  };
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smooth = (value) => {
    const x = clamp(value);
    return x * x * (3 - 2 * x);
  };
  const easeOut = (value) => 1 - Math.pow(1 - clamp(value), 3);

  let storyVisible = true;
  let closingVisible = false;
  let joinVisible = false;
  let frame = 0;
  let storyTop = 0;
  let storyTravel = 1;
  let activeCallout = -1;
  let targetOrbit = Number.NaN;
  let renderedOrbit = Number.NaN;
  let lastAppliedOrbit = Number.NaN;
  let needsSettle = false;
  let focusMaterials = [];
  let reducedStateApplied = false;
  const focusBaseline = new Map();
  // These are the CAD materials that carry the intake's visible roller/pulley system.
  // Keep them distinct so the intake never collapses into a few purple fasteners.
  const intakeMechanismNames = new Set([
    'focus.Intake.m01',
    'focus.Intake.m02',
    'focus.Intake.m04',
    'focus.Intake.m05',
  ]);
  const loaderShownAt = performance.now();
  let loaderDismissTimer = 0;

  function dismissLoader(force = false) {
    if (!loader || loader.classList.contains('is-ready')) return;
    const remaining = force ? 0 : Math.max(0, 1750 - (performance.now() - loaderShownAt));
    if (remaining > 0) {
      window.clearTimeout(loaderDismissTimer);
      loaderDismissTimer = window.setTimeout(() => dismissLoader(true), remaining);
      return;
    }
    loader.classList.add('is-ready');
    loader.setAttribute('aria-hidden', 'true');
    document.body.classList.add('hero-live');
  }

  const loaderTimeout = window.setTimeout(() => dismissLoader(true), 1900);

  function updateGeometry() {
    const pageTop = window.scrollY || document.documentElement.scrollTop;
    storyTop = story.getBoundingClientRect().top + pageTop;
    storyTravel = Math.max(1, story.offsetHeight - stage.offsetHeight);
  }

  function prepareFocusMaterials() {
    focusBaseline.clear();
    focusMaterials = [...(model.model?.materials || [])].filter((material) =>
      /^focus\.(Chassis|Intake|Shooter|Indexer|Other)\./.test(material.name)
    );

    focusMaterials.forEach((material) => {
      const pbr = material.pbrMetallicRoughness;
      focusBaseline.set(material, {
        rgba: [...pbr.baseColorFactor],
        metallic: pbr.metallicFactor,
        roughness: pbr.roughnessFactor,
        emissive: [...material.emissiveFactor],
        mode: material.getAlphaMode(),
        currentMode: material.getAlphaMode(),
        currentLevel: Number.NaN,
        targetLevel: Number.NaN,
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
      saved.currentLevel = Number.NaN;
      saved.targetLevel = Number.NaN;
      saved.currentInspection = Number.NaN;
      material.pbrMetallicRoughness.setBaseColorFactor(saved.rgba);
      material.pbrMetallicRoughness.setMetallicFactor(saved.metallic);
      material.pbrMetallicRoughness.setRoughnessFactor(saved.roughness);
      material.setEmissiveFactor(saved.emissive);
    });
  }

  function applyFocusLevels(levels, force = false) {
    let stillInterpolating = false;
    focusMaterials.forEach((material) => {
      const saved = focusBaseline.get(material);
      if (!saved) return;

      const targetLevel = clamp(levels[saved.group] ?? 0);
      const targetInspection = saved.isIntakeMechanism ? clamp(levels.IntakeInspection ?? 0) : 0;
      saved.targetLevel = targetLevel;
      let level = saved.currentLevel;
      let inspection = saved.currentInspection;
      if (force || !Number.isFinite(level)) {
        level = targetLevel;
      } else {
        const delta = targetLevel - level;
        if (Math.abs(delta) > 0.003) {
          level += delta * 0.2;
          stillInterpolating = true;
        } else {
          level = targetLevel;
        }
      }
      if (force || !Number.isFinite(inspection)) {
        inspection = targetInspection;
      } else {
        const delta = targetInspection - inspection;
        if (Math.abs(delta) > 0.003) {
          inspection += delta * 0.2;
          stillInterpolating = true;
        } else {
          inspection = targetInspection;
        }
      }

      if (!force
        && Math.abs(saved.currentLevel - level) < 0.001
        && Math.abs(saved.currentInspection - inspection) < 0.001) return;
      saved.currentLevel = level;
      saved.currentInspection = inspection;

      const sourceAlpha = saved.rgba[3];
      const intakeClearance = saved.group === 'Intake' ? 0 : clamp(levels.Intake ?? 0);
      const ghostCeiling = 0.48 + ((saved.group === 'Chassis' ? 0.3 : 0.42) - 0.48) * intakeClearance;
      const ghostAlpha = Math.min(sourceAlpha, ghostCeiling);
      const alpha = ghostAlpha + (sourceAlpha - ghostAlpha) * level;
      const targetMode = saved.isIntakePulleySet && inspection > 0.16
        ? 'OPAQUE'
        : alpha >= sourceAlpha - 0.004 ? saved.mode : 'BLEND';

      if (saved.currentMode !== targetMode) {
        material.setAlphaMode(targetMode);
        saved.currentMode = targetMode;
      }

      const luminance = saved.rgba[0] * 0.2126 + saved.rgba[1] * 0.7152 + saved.rgba[2] * 0.0722;
      const shell = clamp(luminance * 0.42, 0.07, 0.22);
      const coolShell = [shell * 0.94, shell * 0.98, shell * 1.05];
      const pulleyMetal = [0.42, 0.44, 0.49];
      const pulleyMix = saved.isIntakePulleySet ? inspection : 0;
      const baseColor = [
        coolShell[0] + (saved.rgba[0] - coolShell[0]) * level,
        coolShell[1] + (saved.rgba[1] - coolShell[1]) * level,
        coolShell[2] + (saved.rgba[2] - coolShell[2]) * level,
      ];
      material.pbrMetallicRoughness.setBaseColorFactor([
        baseColor[0] * (1 - pulleyMix) + pulleyMetal[0] * pulleyMix,
        baseColor[1] * (1 - pulleyMix) + pulleyMetal[1] * pulleyMix,
        baseColor[2] * (1 - pulleyMix) + pulleyMetal[2] * pulleyMix,
        alpha,
      ]);
      material.pbrMetallicRoughness.setMetallicFactor(
        saved.metallic + (Math.max(saved.metallic, 0.28) - saved.metallic) * (1 - level) + (0.64 - saved.metallic) * pulleyMix
      );
      material.pbrMetallicRoughness.setRoughnessFactor(
        saved.roughness + (0.46 - saved.roughness) * (1 - level) * 0.35 + (0.32 - saved.roughness) * pulleyMix
      );
      material.setEmissiveFactor([
        saved.emissive[0] * level + 0.008 * (1 - level) + 0.01 * pulleyMix,
        saved.emissive[1] * level + 0.009 * (1 - level) + 0.011 * pulleyMix,
        saved.emissive[2] * level + 0.013 * (1 - level) + 0.015 * pulleyMix,
      ]);
    });
    return stillInterpolating;
  }

  function setCameraOrbit(orbit, immediate = false, response = 0.18) {
    if (!model.loaded) return;
    targetOrbit = orbit;
    if (immediate || !Number.isFinite(renderedOrbit)) renderedOrbit = orbit;

    const delta = targetOrbit - renderedOrbit;
    if (!immediate && Math.abs(delta) > 0.08) {
      renderedOrbit += delta * response;
      needsSettle = true;
    } else {
      renderedOrbit = targetOrbit;
    }

    if (!Number.isFinite(lastAppliedOrbit) || Math.abs(renderedOrbit - lastAppliedOrbit) >= 0.18 || immediate) {
      const distance = window.innerWidth <= 1080 ? '105%' : '80%';
      model.cameraOrbit = `${renderedOrbit}deg 69deg ${distance}`;
      model.jumpCameraToGoal();
      lastAppliedOrbit = renderedOrbit;
    }
  }

  function focusAt(progress) {
    if (progress <= 0) {
      const full = { Chassis: 1, Intake: 1, Shooter: 1, Indexer: 1, Other: 1, IntakeInspection: 0 };
      return { group: 'Full', index: 0, interpolating: applyFocusLevels(full) };
    }

    if (progress < 0.12) {
      const mix = smooth(progress / 0.12);
      const levels = {
        Chassis: 1 - mix,
        Intake: 1,
        Shooter: 1 - mix,
        Indexer: 1 - mix,
        Other: 1 - mix,
        IntakeInspection: 1,
      };
      return { group: 'Intake', index: 1, interpolating: applyFocusLevels(levels) };
    }

    if (progress >= storyBeats.chassisHoldEnd) {
      const returnMix = smooth((progress - storyBeats.chassisHoldEnd) / (1 - storyBeats.chassisHoldEnd));
      const levels = { Chassis: returnMix, Intake: returnMix, Shooter: returnMix, Indexer: returnMix, Other: returnMix, IntakeInspection: 0 };
      levels.Chassis = 1;
      return { group: 'Full', index: -1, interpolating: applyFocusLevels(levels) };
    }

    const componentProgress = clamp((progress - 0.12) / 0.76);
    const scaled = componentProgress * groups.length;
    const index = Math.min(groups.length - 1, Math.floor(scaled));
    const local = scaled - index;
    const levels = { Chassis: 0, Intake: 0, Shooter: 0, Indexer: 0, Other: 0, IntakeInspection: 0 };
    levels[groups[index]] = 1;
    levels.IntakeInspection = levels.Intake;

    if (index < groups.length - 1 && local > 0.7) {
      const mix = smooth((local - 0.7) / 0.3);
      levels[groups[index]] = 1 - mix;
      levels[groups[index + 1]] = mix;
      levels.IntakeInspection = levels.Intake;
    }

    return { group: groups[index], index: index + 1, interpolating: applyFocusLevels(levels) };
  }

  function showCallout(index) {
    if (index === activeCallout) return;
    callouts.forEach((callout, calloutIndex) => {
      const isActive = calloutIndex === index;
      callout.classList.toggle('is-active', isActive);
      callout.setAttribute('aria-hidden', String(!isActive));
    });
    activeCallout = index;
  }

  function showReducedMotionState() {
    hero.style.opacity = '1';
    hero.style.transform = 'none';
    hero.style.pointerEvents = '';
    hero.inert = false;
    viewer.style.opacity = '1';
    viewer.style.transform = 'none';
    stage.dataset.phase = 'hero';
    stage.dataset.final = 'false';
    if (number) {
      number.style.setProperty('--final-glow', '0');
      number.style.opacity = '0';
      number.style.transform = 'translate(-50%, -50%)';
    }
    setCameraOrbit(115, true);
    if (!reducedStateApplied) {
      restoreModelFocus();
      reducedStateApplied = true;
    }
  }

  function update() {
    frame = 0;
    needsSettle = false;
    if (document.hidden || (!storyVisible && !closingVisible && !joinVisible)) return;
    // Read layout before model/style updates, once per visible photo composition.
    const joinRect = joinVisible && joinWorktable ? joinWorktable.getBoundingClientRect() : null;
    const closingRect = closingVisible && closing ? closing.getBoundingClientRect() : null;

    if (storyVisible) {
      const progress = clamp(((window.scrollY || document.documentElement.scrollTop) - storyTop) / storyTravel);
      progressBar.style.transform = `scaleX(${progress})`;

      if (reduceMotion.matches || story.classList.contains('model-unavailable')) {
        showReducedMotionState();
      } else {
        reducedStateApplied = false;
        const heroExit = easeOut((progress - 0.025) / 0.16);
        const modelCenter = easeOut(progress / 0.2);
        const orbitProgress = smooth(progress / storyBeats.overviewEnd);
        const inspectionProgress = clamp((progress - storyBeats.overviewEnd) / (storyBeats.inspectionEnd - storyBeats.overviewEnd));
        const finalStart = storyBeats.overviewEnd + (storyBeats.inspectionEnd - storyBeats.overviewEnd) * storyBeats.chassisHoldEnd;
        const finalGlow = smooth((progress - finalStart) / (1 - finalStart));

        hero.style.opacity = String(1 - heroExit);
        hero.style.transform = `translate3d(0, ${-heroExit * 3}vh, 0)`;
        hero.style.pointerEvents = heroExit > 0.98 ? 'none' : '';
        hero.inert = heroExit > 0.98;

        viewer.style.opacity = '1';
        viewer.style.transform = mobileLayout.matches
          ? `translate3d(0, ${-modelCenter * 40}%, 0) scale(${1 + modelCenter * 0.05})`
          : `translate3d(${-modelCenter * 21.4}%, ${-modelCenter * 13}%, 0)`;

        if (number) {
          number.style.setProperty('--final-glow', String(finalGlow));
          number.style.opacity = String(modelCenter * (0.48 + finalGlow * 0.4));
          number.style.transform = `translate(-50%, -50%) scale(${1 + modelCenter * 0.035 + finalGlow * 0.02})`;
        }

        let orbitAngle;
        let orbitResponse = 0.18;
        if (progress <= storyBeats.overviewEnd) {
          orbitAngle = 115 + orbitProgress * 360;
          showCallout(0);
          const focus = focusAt(0);
          stage.dataset.phase = progress > 0.1 ? 'inspect' : 'hero';
          needsSettle ||= focus.interpolating;
        } else {
          const focus = focusAt(inspectionProgress);
          needsSettle ||= Boolean(focus.interpolating);
          // Continue the inspection orbit through the chassis, then restore
          // the full assembly. Do not start a second lap for the chassis.
          const inspectionSweep = 150;
          const inspectionEndAngle = 835; // Completes the orbit that began at 475deg.

          if (inspectionProgress < storyBeats.chassisStart) {
            const inspectMix = smooth(inspectionProgress / storyBeats.chassisStart);
            orbitAngle = 475 + inspectMix * inspectionSweep;
          } else if (inspectionProgress < storyBeats.chassisSpinEnd) {
            const chassisOrbit = smooth((inspectionProgress - storyBeats.chassisStart) / (storyBeats.chassisSpinEnd - storyBeats.chassisStart));
            orbitAngle = 475 + inspectionSweep + chassisOrbit * (inspectionEndAngle - 475 - inspectionSweep);
            orbitResponse = 0.3;
          } else if (inspectionProgress < storyBeats.chassisHoldEnd) {
            orbitAngle = inspectionEndAngle;
          } else {
            orbitAngle = inspectionEndAngle;
          }
          showCallout(focus.index);
          stage.dataset.phase = focus.index < 0 ? 'finish' : 'inspect';
        }

        stage.dataset.focus = inspectionProgress > 0 && inspectionProgress < storyBeats.chassisHoldEnd ? 'part' : 'full';
        stage.dataset.final = finalGlow > 0.01 ? 'true' : 'false';

        setCameraOrbit(orbitAngle, false, orbitResponse);
      }
    }

    if (!reduceMotion.matches) {
      if (joinVisible && joinWorktable) {
        const rect = joinRect;
        const depth = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
        joinWorktable.style.setProperty('--main-photo-y', `${(0.5 - depth) * 1.6}rem`);
        joinWorktable.style.setProperty('--build-photo-y', `${(0.5 - depth) * 3.2}rem`);
      }
    }

    if (closingVisible && closingImage) {
      if (reduceMotion.matches) {
        closingImage.style.transform = 'none';
      } else {
        const rect = closingRect;
        const progress = clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
        closingImage.style.transform = `translate3d(0, ${(0.5 - progress) * 4}%, 0) scale(1.04)`;
      }
    }

    if (needsSettle) schedule();
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  function modelUnavailable() {
    if (model.loaded) return;
    dismissLoader(true);
    story.classList.add('model-unavailable');
    viewer.classList.add('has-error');
    if (status) status.textContent = '3D is unavailable on this connection. Explore the team below, or reload to try again.';
    updateGeometry();
    schedule();
  }

  // A blocked module never emits a model error. Do not leave a long empty exhibit.
  window.setTimeout(() => {
    if (!customElements.get('model-viewer')) modelUnavailable();
  }, 12000);

  customElements.whenDefined('model-viewer').then(() => {
    const ModelViewer = customElements.get('model-viewer');
    if (ModelViewer) ModelViewer.minimumRenderScale = mobileLayout.matches ? 0.34 : 0.5;

    const finishModelLoad = () => {
      window.clearTimeout(loaderTimeout);
      dismissLoader();
      prepareFocusMaterials();
      restoreModelFocus();
      targetOrbit = Number.NaN;
      renderedOrbit = Number.NaN;
      lastAppliedOrbit = Number.NaN;
      viewer.classList.add('is-loaded');
      viewer.classList.remove('has-error');
      story.classList.remove('model-unavailable');
      updateGeometry();
      if (status) status.textContent = '3D robot ready';
      schedule();
    };

    model.addEventListener('load', finishModelLoad);
    model.addEventListener('error', () => {
      window.clearTimeout(loaderTimeout);
      dismissLoader();
      modelUnavailable();
    });

    if (model.loaded) finishModelLoad();
    model.removeAttribute('camera-controls');
    model.setAttribute('tabindex', '-1');
  });

  // The page must scroll and reveal content even when WebGL or the model module fails.
    updateGeometry();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === story) storyVisible = entry.isIntersecting;
        if (entry.target === closing) closingVisible = entry.isIntersecting;
        if (entry.target === joinWorktable) joinVisible = entry.isIntersecting;
      });
      if (storyVisible || closingVisible || joinVisible) schedule();
    }, { rootMargin: '75% 0px' });

    observer.observe(story);
    if (closing) observer.observe(closing);
    if (joinWorktable) observer.observe(joinWorktable);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', () => {
      lastAppliedOrbit = Number.NaN;
      updateGeometry();
      schedule();
    }, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    reduceMotion.addEventListener('change', () => {
      reducedStateApplied = false;
      updateGeometry();
      schedule();
    });
    mobileLayout.addEventListener('change', () => {
      const ModelViewer = customElements.get('model-viewer');
      if (ModelViewer) ModelViewer.minimumRenderScale = mobileLayout.matches ? 0.34 : 0.5;
      lastAppliedOrbit = Number.NaN;
      updateGeometry();
      schedule();
    });
    schedule();
})();
