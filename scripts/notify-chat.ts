const fs = require('fs');

async function sendNotification() {
  // 1. Đọc số liệu thống kê trực tiếp từ Allure Report vừa generate
  const summaryPath = './allure-report/widgets/summary.json';
  if (!fs.existsSync(summaryPath)) {
    console.log('Không tìm thấy file summary.json của Allure!');
    return;
  }

  const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
  const { passed = 0, failed = 0, broken = 0, skipped = 0, total = 0 } = summary.statistic;

  // Tính thời gian chạy (ví dụ: 1m 33s)
  const durationMs = summary.time?.duration || 0;
  const totalSec = Math.floor(durationMs / 1000);
  const mins = Math.floor(totalSec / 60);
  const secs = totalSec % 60;
  const durationText = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

  // Trạng thái tổng quan
  const isPass = failed === 0 && broken === 0 && total > 0;
  const statusIcon = isPass ? '🟢' : '🔴';
  const statusLabel = isPass ? 'PASS' : 'FAIL';

  // Thời gian hiện tại theo giờ Việt Nam
  const runTime = new Date().toLocaleString('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour12: false,
  });

  // 2. Lấy thông tin ngữ cảnh từ GitHub Actions
  const repo = process.env.GITHUB_REPOSITORY || 'dragon9968/playwright-framework';
  const branch = process.env.GITHUB_REF_NAME || 'main';
  const shortSha = (process.env.GITHUB_SHA || '').slice(0, 7);
  const actor = process.env.GITHUB_ACTOR || 'dragon9968';
  const eventName = process.env.GITHUB_EVENT_NAME || 'push';
  const triggerText = eventName === 'workflow_dispatch' ? 'bấm tay' : eventName;
  const runId = process.env.GITHUB_RUN_ID || '';

  const reportUrl = 'https://dragon9968.github.io/playwright-framework/';
  const runLogUrl = `https://github.com/${repo}/actions/runs/${runId}`;

  // 3. Gửi tới Google Chat (nếu có cấu hình secret)
  const googleWebhook = process.env.GOOGLE_CHAT_WEBHOOK_URL;
  if (googleWebhook) {
    const googlePayload = {
      cardsV2: [
        {
          cardId: `playwright-ci-${Date.now()}`,
          card: {
            header: {
              title: `${statusIcon} Playwright — GitHub Actions: ${statusLabel} ${passed}/${total} test`,
              subtitle: `Nhánh: ${branch} • Commit: ${shortSha} • Bởi: ${actor}`,
            },
            sections: [
              {
                widgets: [
                  {
                    textParagraph: {
                      text: [
                        `<b>Kết quả:</b>`,
                        `✅ ${passed} passed  •  ❌ ${failed} failed  •  💥 ${broken} broken  •  ⏭️ ${skipped} skipped`,
                        `<b>Thời gian:</b> ${runTime} • chạy ${durationText}`,
                        `<b>Kích hoạt:</b> ${triggerText}`,
                      ].join('<br>'),
                    },
                  },
                  {
                    buttonList: {
                      buttons: [
                        {
                          text: '📊 Allure report',
                          onClick: { openLink: { url: reportUrl } },
                        },
                        {
                          text: '🔍 Log lượt chạy',
                          onClick: { openLink: { url: runLogUrl } },
                        },
                      ],
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    };

    const res = await fetch(googleWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googlePayload),
    });
    console.log('Google Chat status:', res.status);
  }

  // 4. Gửi tới MS Teams Workflows (nếu có cấu hình secret)
  const teamsWebhook = process.env.TEAMS_WEBHOOK_URL;
  if (teamsWebhook) {
    const teamsPayload = {
      type: 'message',
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.adaptive',
          contentUrl: null,
          content: {
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            type: 'AdaptiveCard',
            version: '1.4',
            body: [
              {
                type: 'TextBlock',
                size: 'Medium',
                weight: 'Bolder',
                color: isPass ? 'Good' : 'Attention',
                text: `${statusIcon} Playwright — GitHub Actions: ${statusLabel} ${passed}/${total} test`,
                wrap: true,
              },
              {
                type: 'FactSet',
                facts: [
                  {
                    title: 'Kết quả:',
                    value: `✅ ${passed} passed | ❌ ${failed} failed | 💥 ${broken} broken | ⏭️ ${skipped} skipped`,
                  },
                  {
                    title: 'Thời gian:',
                    value: `${runTime} • chạy ${durationText}`,
                  },
                  {
                    title: 'Chi tiết:',
                    value: `Kích hoạt: ${triggerText} | Nhánh: ${branch} | Commit: ${shortSha} | Bởi: ${actor}`,
                  },
                ],
              },
            ],
            actions: [
              {
                type: 'Action.OpenUrl',
                title: '📊 Allure report',
                url: reportUrl,
              },
              {
                type: 'Action.OpenUrl',
                title: '🔍 Log lượt chạy',
                url: runLogUrl,
              },
            ],
          },
        },
      ],
    };

    const res = await fetch(teamsWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(teamsPayload),
    });
    console.log('MS Teams status:', res.status);
  }
}

sendNotification().catch((err) => {
  console.error('Lỗi gửi thông báo chat:', err);
});