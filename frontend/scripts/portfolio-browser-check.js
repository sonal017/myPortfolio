async (page) => {
  const address = await page.evaluate(() => ({ origin: location.origin, hostname: location.hostname }));
  const baseUrl = address.origin;
  if (!['localhost', '127.0.0.1', '[::1]'].includes(address.hostname)) {
    throw new Error('Run this check only against a local portfolio server.');
  }
  const results = [];
  const errors = [];
  const submissions = [];
  let contactStatus = 503;
  let contactAcknowledged = true;
  const output = 'node_modules/.cache/playwright-cli';
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const recordError = (error) => errors.push(error.message);
  const focused = (locator) => locator.evaluate((element) => element === document.activeElement);

  // Never let this test send a real message, even if the API origin changes.
  const mockRequests = async (route) => {
    const request = route.request();
    if (request.url().split('?')[0].endsWith('/api/contact')) {
      if (request.method() === 'POST') submissions.push(request.postDataJSON());
      await route.fulfill({
        status: request.method() === 'OPTIONS' ? 204 : contactStatus,
        headers: {
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'POST, OPTIONS',
          'access-control-allow-headers': 'content-type',
          'content-type': 'application/json',
        },
        body: request.method() === 'OPTIONS' ? '' : JSON.stringify({ success: contactStatus === 200 && contactAcknowledged }),
      });
    } else if (!['GET', 'HEAD'].includes(request.method())) {
      await route.abort();
    } else {
      await route.continue();
    }
  };
  page.on('pageerror', recordError);
  await page.route('**/*', mockRequests);
  try {
    await page.emulateMedia({ reducedMotion: 'reduce', colorScheme: 'light' });
    await page.goto(baseUrl);
    await page.getByRole('heading', { name: 'Worked Projects', exact: true }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    if (await page.getByRole('button', { name: 'Switch to light theme' }).count()) {
      await page.getByRole('button', { name: 'Switch to light theme' }).click();
    }

    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      const layout = await page.locator('#project-list').evaluate((grid) => {
        const cards = [...grid.querySelectorAll('article')];
        return {
          count: cards.length,
          columns: getComputedStyle(grid).gridTemplateColumns.split(' ').length,
          heights: cards.map((card) => card.querySelector('.project-preview').getBoundingClientRect().height),
          filters: document.querySelectorAll('.project-filters').length,
          featured: document.querySelectorAll('.project-featured').length,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });
      check(layout.count === 6 && !layout.filters && !layout.featured, 'Project grid has missing or extra controls.');
      check(layout.columns === (width < 768 ? 1 : 2), 'Unexpected columns at ' + width);
      check(!layout.overflow, 'Horizontal overflow at ' + width);
      check(Math.max(...layout.heights) - Math.min(...layout.heights) < 1, 'Unequal screenshot frames at ' + width);
      results.push('Grid and overflow: ' + width + 'px');
    }
    for (const image of await page.locator('.project-preview img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate((element) => element.decode());
      check(await image.evaluate((element) => element.naturalWidth > 0), 'Project image failed to load.');
    }
    results.push('All six real project images load');
    const cards = page.locator('#project-list article');
    for (let index = 0; index < 4; index++) {
      check(await cards.nth(index).getByRole('link', { name: /Source code/ }).count() === 0, 'Company source link exposed.');
    }

    const cvLinks = page.getByRole('link', { name: 'Download CV', exact: true });
    check(await cvLinks.count() === 2, 'A CV download link is missing.');
    for (let index = 0; index < 2; index++) {
      const downloadEvent = page.waitForEvent('download');
      await cvLinks.nth(index).click();
      const download = await downloadEvent;
      check(download.suggestedFilename() === 'Sonalkumar_Singh_CV_2026.pdf', 'Incorrect CV file.');
      check(await download.failure() === null, 'CV download failed.');
      await download.saveAs(output + '/cv-download-' + (index + 1) + '.pdf');
    }
    results.push('Both CV buttons download the current PDF');

    await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    await page.reload();
    check(await page.locator('html').getAttribute('data-theme') === 'dark', 'Theme did not persist.');
    await page.getByRole('button', { name: 'Switch to light theme' }).click();
    results.push('Theme toggle and persistence');

    await page.setViewportSize({ width: 667, height: 375 });
    await page.getByRole('link', { name: 'Sonalkumar Singh, home' }).click();
    const menu = page.getByRole('button', { name: 'Open navigation menu' });
    await menu.click();
    await page.keyboard.press('Escape');
    check(await focused(menu), 'Escape did not return focus to the menu.');
    await menu.click();
    await page.locator('#mobile-navigation').getByRole('link', { name: 'GitHub', exact: true }).focus();
    await page.keyboard.press('Tab');
    await page.waitForFunction(() => !document.getElementById('mobile-navigation'));
    const projectsLink = page.getByRole('link', { name: 'View projects', exact: true });
    check(await focused(projectsLink), 'Tab did not move from the menu into the hero.');
    await page.waitForFunction(() => document.activeElement.getBoundingClientRect().top >= document.querySelector('.site-nav').getBoundingClientRect().bottom);
    results.push('Landscape navigation: Escape, Tab, and unobscured focus');

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.getByRole('link', { name: 'Contact', exact: true }).click();
    const send = page.getByRole('button', { name: 'Send message', exact: true });
    const name = page.getByRole('textbox', { name: 'Name', exact: true });
    const email = page.getByRole('textbox', { name: 'Email', exact: true });
    const message = page.getByRole('textbox', { name: 'Message', exact: true });
    await send.click();
    check(await focused(name), 'Validation did not focus the first field.');
    check(await page.locator('[aria-invalid="true"]').count() === 3, 'Missing inline validation.');
    check(submissions.length === 0, 'Invalid form attempted submission.');
    await name.fill('Portfolio QA');
    await email.fill('portfolio-qa@example.com');
    await message.fill('Mocked browser regression check.');
    await send.click();
    await page.getByRole('alert').waitFor();
    check(await message.inputValue() === 'Mocked browser regression check.', 'Failure lost the message.');
    contactStatus = 429;
    await send.click();
    await page.getByRole('alert').filter({ hasText: 'Please wait 15 minutes' }).waitFor();
    check(await message.inputValue() === 'Mocked browser regression check.', 'Rate limiting lost the message.');
    contactStatus = 200;
    contactAcknowledged = false;
    await send.click();
    await page.getByRole('alert').filter({ hasText: "Your message couldn't be sent" }).waitFor();
    check(await page.getByRole('dialog').count() === 0, 'Unconfirmed save displayed success.');
    contactAcknowledged = true;
    await message.press('Control+Enter');
    const dialog = page.getByRole('dialog');
    await dialog.waitFor();
    check(await name.inputValue() === '', 'Success did not clear the form.');
    const close = page.getByRole('button', { name: 'Close message confirmation' });
    check(await focused(close), 'Dialog did not receive focus.');
    await close.press('Shift+Tab');
    check(await focused(page.getByRole('button', { name: 'Done', exact: true })), 'Dialog focus escaped backwards.');
    await page.keyboard.press('Tab');
    check(await focused(close), 'Dialog focus escaped forwards.');
    await page.screenshot({ path: output + '/contact-success.png' });
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    check(await focused(send), 'Dialog did not restore submit focus.');
    check(submissions.length === 4, 'Unexpected number of mocked requests.');
    results.push('Contact: validation, 503/429 recovery, confirmed save, keyboard submit, dialog focus');

    const staticContext = await page.context().browser().newContext({
      javaScriptEnabled: false,
      viewport: { width: 390, height: 844 },
      serviceWorkers: 'block',
    });
    try {
      const staticPage = await staticContext.newPage();
      await staticPage.goto(baseUrl);
      check(await staticPage.getByRole('heading', { name: 'Worked Projects', exact: true }).count() === 1, 'Static heading is missing.');
      check(await staticPage.locator('.project-card').count() === 6, 'Static project grid is incomplete.');
      check(await staticPage.locator('form, .project-filters, .project-featured').count() === 0, 'Static page contains interactive-only UI.');
      await staticPage.getByRole('link', { name: 'Work', exact: true }).click();
      check(await staticPage.evaluate(() => location.hash) === '#projects', 'Static section navigation failed.');
      await staticPage.screenshot({ path: output + '/portfolio-no-js.png' });
      results.push('No-JavaScript projects and navigation');
    } finally {
      await staticContext.close();
    }
    await page.getByRole('link', { name: 'Work', exact: true }).click();
    await page.screenshot({ path: output + '/portfolio-desktop.png' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#projects-heading').scrollIntoViewIfNeeded();
    await page.screenshot({ path: output + '/portfolio-mobile.png' });
    check(errors.length === 0, 'Page errors: ' + errors.join('; '));
    return { passed: results.length, checks: results, mockedSubmissions: submissions.length, pageErrors: errors };
  } finally {
    page.off('pageerror', recordError);
    await page.unroute('**/*', mockRequests);
  }
}
