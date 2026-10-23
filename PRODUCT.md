# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The site serves prospective student members, families, sponsors, mentors, competition visitors, and the wider FRC community. The homepage priority is the team introduction first, student recruitment second, and sponsorship third.

## Product Purpose

KnightFall FRC Team 6901 uses the site to present its current robot and engineering work, introduce high school students to the team, document its competitive history and outreach, and create a clear path for sponsors and community partners to get involved.

## Positioning

KnightFall is a student-led, nonprofit FIRST Robotics Competition team in Frisco, Texas. Students turn ideas into competition robots while developing practical skills in CAD, programming, machining, teamwork, problem-solving, and leadership.

## Operating Context

Visitors often arrive before or during competition events, while evaluating an extracurricular program, or while considering a sponsorship. The site includes a homepage, team information, season history, outreach work, sponsorship packages, a photo gallery, and a contact form.

## Capabilities and Constraints

- Preserve the existing Astro project and its working routes.
- Preserve factual team history, sponsor information, outreach descriptions, sponsorship packages, and contact workflow unless the user explicitly revises them.
- The homepage should lead with the team introduction, then recruitment, then sponsorship. The robot appears through real competition photography.
- The design must be responsive with dark and light themes.
- The site shows no 3D robot model. The Lancelot CAD was taken off the homepage on 2026-10-23 at the user's request; its files stay in the repo unused. Do not reintroduce it unless asked.

## Brand Commitments

- Name: KnightFall, FRC Team 6901.
- Location: Frisco, Texas.
- Established purple and black team identity. Red must not be used.
- Existing KnightFall logos and real team photography are authoritative brand assets.
- The user authorized a substantial original redesign: cinematic robotics and an engineering art-portfolio feel. Preserve the team identity and real content, not the previous layout.

## Evidence on Hand

- Team and robot photography in `public/images/photo_gallery/`, including 2026 competition, pit, robot, and team images.
- KnightFall logos in `public/images/6901_logos/`.
- Current sponsor logos in `public/images/partner_logos/`.
- Outreach photography in `public/images/outreach_gallery/`.
- Web-optimized Lancelot model at `public/models/lancelot.glb` (2.27 MB), reduced from the untouched 35.61 MB source. Kept in the repo but not shown on the site.
- Season records from 2018 through 2026 in `src/pages/seasons.astro`.
- Current sponsor, outreach, package, and team copy in `src/pages/team.astro`.

## Product Principles

1. Let the robot prove the team's engineering before marketing copy does.
2. Make joining the team feel achievable and exciting for students.
3. Give sponsors clear evidence, recognition, and an obvious next action.
4. Use real team work, people, and results instead of invented claims.
5. Keep the experience fast and understandable on competition-day mobile connections.

## Accessibility & Inclusion

The redesigned site should preserve semantic navigation, keyboard access, useful alternative text, high contrast, and reduced-motion support.
