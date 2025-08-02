// 订阅续期通知网站 - 基于CloudFlare Workers
// from https://github.com/GlassBento/SubsTracker

const loginPage = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>登录 · GlassBento</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      :root {
        --glass: rgba(255, 255, 255, 0.22);
        --glass-border: rgba(255, 255, 255, 0.3);
        --glass-shadow: 0 8px 32px rgba(31, 38, 135, 0.35);
        --backdrop: blur(10px);
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      body {
        height: 100vh;
        display: grid;
        place-items: center;
        font-family: "Poppins", sans-serif;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        overflow: hidden;
      }
      .login-card {
        width: 90vw;
        max-width: 380px;
        padding: 48px 32px;
        background: var(--glass);
        border: 2px solid var(--glass-border);
        border-radius: 28px;
        box-shadow: var(--glass-shadow);
        backdrop-filter: var(--backdrop);
        -webkit-backdrop-filter: var(--backdrop);
        color: #fff;
        text-align: center;
      }
      .logo {
        width: 70px;
        height: 70px;
        margin: 0 auto 24px;
        display: grid;
        place-items: center;
        background: var(--glass);
        border-radius: 50%;
        box-shadow: var(--glass-shadow);
      }
      h1 {
        font-size: 2.125rem;
        font-weight: 700;
        margin-bottom: 8px;
      }
      p {
        font-size: 0.875rem;
        opacity: 0.8;
        margin-bottom: 32px;
      }
      .input {
        width: 100%;
        padding: 14px 18px;
        margin-bottom: 20px;
        border: none;
        border-radius: 12px;
        background: var(--glass);
        color: #fff;
        font-size: 1rem;
        box-shadow: inset 0 0 0 1px var(--glass-border);
        transition: 0.3s;
      }
      .input:focus {
        outline: none;
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.6);
      }
      .btn {
        width: 100%;
        padding: 14px 0;
        border: none;
        border-radius: 12px;
        background: var(--glass);
        color: #fff;
        font-size: 1.125rem;
        font-weight: 600;
        box-shadow: var(--glass-shadow);
        cursor: pointer;
        transition: 0.3s;
      }
      .btn:hover {
        transform: translateY(-2px);
      }
      .btn:active {
        transform: translateY(0);
      }
      .error {
        color: #ff4757;
        margin-top: 12px;
        font-size: 0.875rem;
        height: 1rem;
      }
    </style>
  </head>
  <body>
    <div class="login-card">
      <div class="logo">
        <svg
          width="32"
          height="32"
          fill="none"
          stroke="#fff"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </div>
      <h1>GlassBento</h1>
      <p>Sign in to manage subscriptions</p>
      <form id="loginForm">
        <input
          class="input"
          type="text"
          id="user"
          placeholder="Username"
          required
        />
        <input
          class="input"
          type="password"
          id="pass"
          placeholder="Password"
          required
        />
        <button class="btn" type="submit">Sign In</button>
        <div class="error" id="errorMsg"></div>
      </form>
    </div>

    <script>
      document.getElementById("loginForm").addEventListener("submit", (e) => {
        e.preventDefault();
        // mock login
        document.getElementById("errorMsg").textContent = "";
        location.href = "index.html";
      });
    </script>
  </body>
</html>`;

const subListPage = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>订阅列表 • GlassBento</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
      :root{
        --glass: rgba(255,255,255,0.18);
        --glass-bd: rgba(255,255,255,0.3);
        --glass-sh: 0 8px 32px rgba(31,38,135,.35);
        --blur: blur(12px);
      }
      *{box-sizing:border-box;margin:0;padding:0}
      body{
        height:100vh;
        font-family:'Poppins',sans-serif;
        background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
        display:grid;place-items:center;
        color:#fff;
        overflow:hidden;
      }
      .bento{
        display:grid;
        grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
        gap:1.2rem;
        width:90vw;
        max-width:1200px;
        height:85vh;
      }
      .card{
        background:var(--glass);
        border:1px solid var(--glass-bd);
        border-radius:20px;
        box-shadow:var(--glass-sh);
        backdrop-filter:var(--blur);
        -webkit-backdrop-filter:var(--blur);
        padding:2rem;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        transition:transform .3s;
      }
      .card:hover{transform:translateY(-4px)}
      .sub-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.6rem 0;
        border-bottom: 1px solid rgba(255,255,255,0.15);
      }
      .tag {
        padding: 0.2rem 0.6rem;
        border-radius: 0.5rem;
        font-size: 0.75rem;
        margin-left: 0.4rem;
      }
      .tag.active { background: rgba(39,174,96,0.7); }
      .detail-btn {
        padding: 0.3rem 0.8rem;
        border-radius: 0.5rem;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        color: #fff;
        font-size: 0.75rem;
        cursor: pointer;
      }

      /* 弹窗样式 */
      .modal-overlay {
        position: fixed; inset: 0;
        background: rgba(0,0,0,.45);
        backdrop-filter: blur(4px);
        display: none; align-items: center; justify-content: center;
        z-index: 999;
      }
      .modal-glass {
        width: 90vw; max-width: 420px;
        background: var(--glass);
        border: 1px solid var(--glass-border);
        border-radius: 20px;
        box-shadow: var(--glass-shadow);
        backdrop-filter: var(--backdrop);
        padding: 2rem 1.5rem 1.5rem;
        display: flex; flex-direction: column; gap: .8rem;
        color: #fff;
      }
      .large{grid-column:span 2;grid-row:span 2}
      .h1{font-size:2.8rem;font-weight:700}
      .h2{font-size:1.8rem;font-weight:600}
      .h3{font-size:1.4rem;font-weight:600}
      .tag{display:inline-block;padding:.4rem .8rem;border-radius:.8rem;font-size:.75rem;background:var(--glass)}
      .row{display:flex;justify-content:space-between;align-items:center;padding:.4rem 0;font-size:1rem}
      .btn{
        padding:.8rem 1.4rem;border:none;border-radius:12px;
        background:var(--glass);border:1px solid var(--glass-bd);
        color:#fff;font-weight:600;cursor:pointer;
      }
      .btn:hover{background:rgba(255,255,255,.25)}
      .scroll{overflow-y:auto;scrollbar-width:none}
      .scroll::-webkit-scrollbar{display:none}
      .empty{text-align:center}
    </style>
  </head>
  <body>
    <div class="bento">
      <!-- 欢迎 -->
      <div class="card large">
        <div>
          <h1>Hi, Alex</h1>
          <p>Welcome back to your subscriptions</p>
        </div>
        <button class="btn" onclick="location.href='login.html'">Logout</button>
      </div>

      <!-- 统计 -->
      <div class="card"><h2>4</h2><p>Active</p></div>
      <div class="card"><h2>$99</h2><p>This Month</p></div>

      <!-- 下一个扣费 -->
      <div class="card">
        <h3>Upcoming</h3>
        <div class="row"><span>Music</span><span class="tag">May 25 · $12</span></div>
        <div class="row"><span>Cloud</span><span class="tag">Jun 5 · $8</span></div>
      </div>

      <!-- 列表 -->
      <div class="card large scroll" id="subscriptionsSection">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
          <h3>All Subscriptions</h3>
          <button class="btn" onclick="openNewModal()">+ New</button>
        </div>
        <!-- 示例卡片 -->
        <div class="sub-card">
          <div>
            <strong>Spotify</strong>
            <span class="tag">Music</span>
            <span class="tag active">Active</span>
          </div>
          <button class="detail-btn" onclick="location.href='detail.html?id=spotify'">明细</button>
        </div>

        <!-- ========= 添加订阅弹窗 ========= -->
        <div id="newModal" class="modal-overlay" onclick="closeNewModal()">
          <div class="modal-glass" onclick="event.stopPropagation()">
            <h2>添加新订阅</h2>

            <label>订阅名称 *</label>
            <input type="text" id="subName" placeholder="例如 Netflix" required>

            <label>订阅类型</label>
            <input type="text" id="subType" placeholder="流媒体 / 云服务 / 软件等">

            <label><input type="checkbox" id="useLunar"> 周期按农历</label>

            <label>开始日期</label>
            <input type="date" id="startDate" value="2025-08-02">

            <label>周期数值 *</label>
            <input type="number" id="periodVal" value="1" min="1">

            <label>周期单位</label>
            <select id="periodUnit">
              <option value="day">天</option>
              <option value="month" selected>月</option>
              <option value="year">年</option>
            </select>

            <label>到期日期 *</label>
            <input type="date" id="expiryDate" value="2025-09-02">

            <label>提前提醒天数</label>
            <input type="number" id="remindDays" value="7" min="0">

            <label><input type="checkbox" id="isActive" checked> 启用订阅</label>
            <label><input type="checkbox" id="autoRenew" checked> 自动续订</label>

            <label>备注</label>
            <textarea id="notes" rows="2" placeholder="可添加相关备注信息"></textarea>

            <div style="margin-top:1rem;display:flex;gap:.6rem">
              <button class="btn" onclick="saveSubscription()">保存</button>
              <button class="btn" onclick="closeNewModal()">取消</button>
            </div>
          </div>
        </div>

      <!-- 快速操作 -->
      <div class="card">
        <h3>Actions</h3>
        <button class="btn mb-2" onclick="alert('新建订阅')">➕ New</button>
        <button class="btn" onclick="alert('设置')">⚙️ Settings</button>
        <button class="btn" onclick="location.href='detail.html?id=spotify'">📚 Details</button>
      </div>
    </div>
    <script>
      function openNewModal() { document.getElementById('newModal').style.display = 'flex'; }
      function closeNewModal() { document.getElementById('newModal').style.display = 'none'; }
      function saveSubscription() {
        /* 此处可调用 API 发送数据 */
        closeNewModal();
      }
    </script>
  </body>
</html>`;

const configPage = ``;

const adminPage = ``;

// 管理页面
const admin = {
  async handleRequest(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;

      console.log("[管理页面] 访问路径:", pathname);

      const token = getCookieValue(request.headers.get("Cookie"), "token");
      console.log("[管理页面] Token存在:", !!token);

      const config = await getConfig(env);
      const user = token ? await verifyJWT(token, config.JWT_SECRET) : null;

      console.log("[管理页面] 用户验证结果:", !!user);

      if (!user) {
        console.log("[管理页面] 用户未登录，重定向到登录页面");
        return new Response("", {
          status: 302,
          headers: { Location: "/" },
        });
      }

      if (pathname === "/admin/config") {
        return new Response(configPage, {
          headers: { "Content-Type": "text/html; charset=utf-8" },
        });
      }

      return new Response(adminPage, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    } catch (error) {
      console.error("[管理页面] 处理请求时出错:", error);
      return new Response("服务器内部错误", {
        status: 500,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
  },
};

// 处理API请求
const api = {
  async handleRequest(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.slice(4);
    const method = request.method;

    const config = await getConfig(env);

    if (path === "/login" && method === "POST") {
      const body = await request.json();

      if (
        body.username === config.ADMIN_USERNAME &&
        body.password === config.ADMIN_PASSWORD
      ) {
        const token = await generateJWT(body.username, config.JWT_SECRET);

        return new Response(JSON.stringify({ success: true }), {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie":
              "token=" +
              token +
              "; HttpOnly; Path=/; SameSite=Strict; Max-Age=86400",
          },
        });
      } else {
        return new Response(
          JSON.stringify({ success: false, message: "用户名或密码错误" }),
          { headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (path === "/logout" && (method === "GET" || method === "POST")) {
      return new Response("", {
        status: 302,
        headers: {
          Location: "/",
          "Set-Cookie": "token=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0",
        },
      });
    }

    const token = getCookieValue(request.headers.get("Cookie"), "token");
    const user = token ? await verifyJWT(token, config.JWT_SECRET) : null;

    if (!user && path !== "/login") {
      return new Response(
        JSON.stringify({ success: false, message: "未授权访问" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    if (path === "/config") {
      if (method === "GET") {
        const { JWT_SECRET, ADMIN_PASSWORD, ...safeConfig } = config;
        return new Response(JSON.stringify(safeConfig), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (method === "POST") {
        try {
          const newConfig = await request.json();

          const updatedConfig = {
            ...config,
            ADMIN_USERNAME: newConfig.ADMIN_USERNAME || config.ADMIN_USERNAME,
            TG_BOT_TOKEN: newConfig.TG_BOT_TOKEN || "",
            TG_CHAT_ID: newConfig.TG_CHAT_ID || "",
            NOTIFYX_API_KEY: newConfig.NOTIFYX_API_KEY || "",
            WEBHOOK_URL: newConfig.WEBHOOK_URL || "",
            WEBHOOK_METHOD: newConfig.WEBHOOK_METHOD || "POST",
            WEBHOOK_HEADERS: newConfig.WEBHOOK_HEADERS || "",
            WEBHOOK_TEMPLATE: newConfig.WEBHOOK_TEMPLATE || "",
            SHOW_LUNAR: newConfig.SHOW_LUNAR === true,
            WECHATBOT_WEBHOOK: newConfig.WECHATBOT_WEBHOOK || "",
            WECHATBOT_MSG_TYPE: newConfig.WECHATBOT_MSG_TYPE || "text",
            WECHATBOT_AT_MOBILES: newConfig.WECHATBOT_AT_MOBILES || "",
            WECHATBOT_AT_ALL: newConfig.WECHATBOT_AT_ALL || "false",
            RESEND_API_KEY: newConfig.RESEND_API_KEY || "",
            EMAIL_FROM: newConfig.EMAIL_FROM || "",
            EMAIL_FROM_NAME: newConfig.EMAIL_FROM_NAME || "",
            EMAIL_TO: newConfig.EMAIL_TO || "",
            ENABLED_NOTIFIERS: newConfig.ENABLED_NOTIFIERS || ["notifyx"],
          };

          if (newConfig.ADMIN_PASSWORD) {
            updatedConfig.ADMIN_PASSWORD = newConfig.ADMIN_PASSWORD;
          }

          // 确保JWT_SECRET存在且安全
          if (
            !updatedConfig.JWT_SECRET ||
            updatedConfig.JWT_SECRET === "your-secret-key"
          ) {
            updatedConfig.JWT_SECRET = generateRandomSecret();
            console.log("[安全] 生成新的JWT密钥");
          }

          await env.SUBSCRIPTIONS_KV.put(
            "config",
            JSON.stringify(updatedConfig)
          );

          return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          console.error("配置保存错误:", error);
          return new Response(
            JSON.stringify({
              success: false,
              message: "更新配置失败: " + error.message,
            }),
            { status: 400, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }

    if (path === "/test-notification" && method === "POST") {
      try {
        const body = await request.json();
        let success = false;
        let message = "";

        if (body.type === "telegram") {
          const testConfig = {
            ...config,
            TG_BOT_TOKEN: body.TG_BOT_TOKEN,
            TG_CHAT_ID: body.TG_CHAT_ID,
          };

          const content =
            "*测试通知*\n\n这是一条测试通知，用于验证Telegram通知功能是否正常工作。\n\n发送时间: " +
            formatBeijingTime();
          success = await sendTelegramNotification(content, testConfig);
          message = success
            ? "Telegram通知发送成功"
            : "Telegram通知发送失败，请检查配置";
        } else if (body.type === "notifyx") {
          const testConfig = {
            ...config,
            NOTIFYX_API_KEY: body.NOTIFYX_API_KEY,
          };

          const title = "测试通知";
          const content =
            "## 这是一条测试通知\n\n用于验证NotifyX通知功能是否正常工作。\n\n发送时间: " +
            formatBeijingTime();
          const description = "测试NotifyX通知功能";

          success = await sendNotifyXNotification(
            title,
            content,
            description,
            testConfig
          );
          message = success
            ? "NotifyX通知发送成功"
            : "NotifyX通知发送失败，请检查配置";
        } else if (body.type === "webhook") {
          const testConfig = {
            ...config,
            WEBHOOK_URL: body.WEBHOOK_URL,
            WEBHOOK_METHOD: body.WEBHOOK_METHOD,
            WEBHOOK_HEADERS: body.WEBHOOK_HEADERS,
            WEBHOOK_TEMPLATE: body.WEBHOOK_TEMPLATE,
          };

          const title = "测试通知";
          const content =
            "这是一条测试通知，用于验证企业微信应用通知功能是否正常工作。\n\n发送时间: " +
            formatBeijingTime();

          success = await sendWebhookNotification(title, content, testConfig);
          message = success
            ? "企业微信应用通知发送成功"
            : "企业微信应用通知发送失败，请检查配置";
        } else if (body.type === "wechatbot") {
          const testConfig = {
            ...config,
            WECHATBOT_WEBHOOK: body.WECHATBOT_WEBHOOK,
            WECHATBOT_MSG_TYPE: body.WECHATBOT_MSG_TYPE,
            WECHATBOT_AT_MOBILES: body.WECHATBOT_AT_MOBILES,
            WECHATBOT_AT_ALL: body.WECHATBOT_AT_ALL,
          };

          const title = "测试通知";
          const content =
            "这是一条测试通知，用于验证企业微信机器人功能是否正常工作。\n\n发送时间: " +
            formatBeijingTime();

          success = await sendWechatBotNotification(title, content, testConfig);
          message = success
            ? "企业微信机器人通知发送成功"
            : "企业微信机器人通知发送失败，请检查配置";
        } else if (body.type === "email") {
          const testConfig = {
            ...config,
            RESEND_API_KEY: body.RESEND_API_KEY,
            EMAIL_FROM: body.EMAIL_FROM,
            EMAIL_FROM_NAME: body.EMAIL_FROM_NAME,
            EMAIL_TO: body.EMAIL_TO,
          };

          const title = "测试通知";
          const content =
            "这是一条测试通知，用于验证邮件通知功能是否正常工作。\n\n发送时间: " +
            formatBeijingTime();

          success = await sendEmailNotification(title, content, testConfig);
          message = success
            ? "邮件通知发送成功"
            : "邮件通知发送失败，请检查配置";
        }

        return new Response(JSON.stringify({ success, message }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("测试通知失败:", error);
        return new Response(
          JSON.stringify({
            success: false,
            message: "测试通知失败: " + error.message,
          }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    if (path === "/subscriptions") {
      if (method === "GET") {
        const subscriptions = await getAllSubscriptions(env);
        return new Response(JSON.stringify(subscriptions), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (method === "POST") {
        const subscription = await request.json();
        const result = await createSubscription(subscription, env);

        return new Response(JSON.stringify(result), {
          status: result.success ? 201 : 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    if (path.startsWith("/subscriptions/")) {
      const parts = path.split("/");
      const id = parts[2];

      if (parts[3] === "toggle-status" && method === "POST") {
        const body = await request.json();
        const result = await toggleSubscriptionStatus(id, body.isActive, env);

        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (parts[3] === "test-notify" && method === "POST") {
        const result = await testSingleSubscriptionNotification(id, env);
        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 500,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (method === "GET") {
        const subscription = await getSubscription(id, env);

        return new Response(JSON.stringify(subscription), {
          headers: { "Content-Type": "application/json" },
        });
      }

      if (method === "PUT") {
        const subscription = await request.json();
        const result = await updateSubscription(id, subscription, env);

        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (method === "DELETE") {
        const result = await deleteSubscription(id, env);

        return new Response(JSON.stringify(result), {
          status: result.success ? 200 : 400,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // 处理第三方通知API
    if (path.startsWith("/notify/")) {
      const code = path.split("/")[2];
      if (method === "POST") {
        try {
          const body = await request.json();
          const title = body.title || "第三方通知";
          const content = body.content || "";

          if (!content) {
            return new Response(
              JSON.stringify({ message: "缺少必填参数 content" }),
              { status: 400, headers: { "Content-Type": "application/json" } }
            );
          }

          const config = await getConfig(env);

          // 使用多渠道发送通知
          await sendNotificationToAllChannels(
            title,
            content,
            config,
            "[第三方API]"
          );

          return new Response(
            JSON.stringify({
              message: "发送成功",
              response: {
                errcode: 0,
                errmsg: "ok",
                msgid: "MSGID" + Date.now(),
              },
            }),
            { headers: { "Content-Type": "application/json" } }
          );
        } catch (error) {
          console.error("[第三方API] 发送通知失败:", error);
          return new Response(
            JSON.stringify({
              message: "发送失败",
              response: {
                errcode: 1,
                errmsg: error.message,
              },
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }
    }

    return new Response(
      JSON.stringify({ success: false, message: "未找到请求的资源" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  },
};

// 农历转换工具函数
const lunarCalendar = {
  // 农历数据 (1900-2100年)
  lunarInfo: [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0,
    0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540,
    0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50,
    0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0,
    0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2,
    0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573,
    0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6, 0x0ab50, 0x04b60, 0x0aae4,
    0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0, 0x04dd5,
    0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6,
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46,
    0x0ab60, 0x09570, 0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58,
    0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960, 0x0d954, 0x0d4a0, 0x0da50,
    0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950, 0x0b4a0,
    0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260,
    0x0ea65, 0x0d530, 0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0,
    0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0, 0x056d0, 0x055b2, 0x049b0,
    0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0,
  ],

  // 天干地支
  gan: ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"],
  zhi: ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"],

  // 农历月份
  months: [
    "正",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
    "冬",
    "腊",
  ],

  // 农历日期
  days: [
    "初一",
    "初二",
    "初三",
    "初四",
    "初五",
    "初六",
    "初七",
    "初八",
    "初九",
    "初十",
    "十一",
    "十二",
    "十三",
    "十四",
    "十五",
    "十六",
    "十七",
    "十八",
    "十九",
    "二十",
    "廿一",
    "廿二",
    "廿三",
    "廿四",
    "廿五",
    "廿六",
    "廿七",
    "廿八",
    "廿九",
    "三十",
  ],

  // 获取农历年天数
  lunarYearDays: function (year) {
    let sum = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      sum += this.lunarInfo[year - 1900] & i ? 1 : 0;
    }
    return sum + this.leapDays(year);
  },

  // 获取闰月天数
  leapDays: function (year) {
    if (this.leapMonth(year)) {
      return this.lunarInfo[year - 1900] & 0x10000 ? 30 : 29;
    }
    return 0;
  },

  // 获取闰月月份
  leapMonth: function (year) {
    return this.lunarInfo[year - 1900] & 0xf;
  },

  // 获取农历月天数
  monthDays: function (year, month) {
    return this.lunarInfo[year - 1900] & (0x10000 >> month) ? 30 : 29;
  },

  // 公历转农历
  solar2lunar: function (year, month, day) {
    if (year < 1900 || year > 2100) return null;

    const baseDate = new Date(1900, 0, 31);
    const objDate = new Date(year, month - 1, day);
    let offset = Math.floor((objDate - baseDate) / 86400000);

    let temp = 0;
    let lunarYear = 1900;

    for (lunarYear = 1900; lunarYear < 2101 && offset > 0; lunarYear++) {
      temp = this.lunarYearDays(lunarYear);
      offset -= temp;
    }

    if (offset < 0) {
      offset += temp;
      lunarYear--;
    }

    let lunarMonth = 1;
    let leap = this.leapMonth(lunarYear);
    let isLeap = false;

    for (lunarMonth = 1; lunarMonth < 13 && offset > 0; lunarMonth++) {
      if (leap > 0 && lunarMonth === leap + 1 && !isLeap) {
        --lunarMonth;
        isLeap = true;
        temp = this.leapDays(lunarYear);
      } else {
        temp = this.monthDays(lunarYear, lunarMonth);
      }

      if (isLeap && lunarMonth === leap + 1) isLeap = false;
      offset -= temp;
    }

    if (offset === 0 && leap > 0 && lunarMonth === leap + 1) {
      if (isLeap) {
        isLeap = false;
      } else {
        isLeap = true;
        --lunarMonth;
      }
    }

    if (offset < 0) {
      offset += temp;
      --lunarMonth;
    }

    const lunarDay = offset + 1;

    // 生成农历字符串
    const ganIndex = (lunarYear - 4) % 10;
    const zhiIndex = (lunarYear - 4) % 12;
    const yearStr = this.gan[ganIndex] + this.zhi[zhiIndex] + "年";
    const monthStr = (isLeap ? "闰" : "") + this.months[lunarMonth - 1] + "月";
    const dayStr = this.days[lunarDay - 1];

    return {
      year: lunarYear,
      month: lunarMonth,
      day: lunarDay,
      isLeap: isLeap,
      yearStr: yearStr,
      monthStr: monthStr,
      dayStr: dayStr,
      fullStr: yearStr + monthStr + dayStr,
    };
  },
};

// 农历业务模块
const lunarBiz = {
  // 农历加周期，返回新的农历日期对象
  addLunarPeriod(lunar, periodValue, periodUnit) {
    let { year, month, day, isLeap } = lunar;
    if (periodUnit === "year") {
      year += periodValue;
      const leap = lunarCalendar.leapMonth(year);
      if (isLeap && leap === month) {
        isLeap = true;
      } else {
        isLeap = false;
      }
    } else if (periodUnit === "month") {
      let totalMonths = (year - 1900) * 12 + (month - 1) + periodValue;
      year = Math.floor(totalMonths / 12) + 1900;
      month = (totalMonths % 12) + 1;
      const leap = lunarCalendar.leapMonth(year);
      if (isLeap && leap === month) {
        isLeap = true;
      } else {
        isLeap = false;
      }
    } else if (periodUnit === "day") {
      const solar = lunarBiz.lunar2solar(lunar);
      const date = new Date(
        solar.year,
        solar.month - 1,
        solar.day + periodValue
      );
      return lunarCalendar.solar2lunar(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate()
      );
    }
    let maxDay = isLeap
      ? lunarCalendar.leapDays(year)
      : lunarCalendar.monthDays(year, month);
    let targetDay = Math.min(day, maxDay);
    while (targetDay > 0) {
      let solar = lunarBiz.lunar2solar({ year, month, day: targetDay, isLeap });
      if (solar) {
        return { year, month, day: targetDay, isLeap };
      }
      targetDay--;
    }
    return { year, month, day, isLeap };
  },
  // 农历转公历（遍历法，适用1900-2100年）
  lunar2solar(lunar) {
    for (let y = lunar.year - 1; y <= lunar.year + 1; y++) {
      for (let m = 1; m <= 12; m++) {
        for (let d = 1; d <= 31; d++) {
          const date = new Date(y, m - 1, d);
          if (
            date.getFullYear() !== y ||
            date.getMonth() + 1 !== m ||
            date.getDate() !== d
          )
            continue;
          const l = lunarCalendar.solar2lunar(y, m, d);
          if (
            l &&
            l.year === lunar.year &&
            l.month === lunar.month &&
            l.day === lunar.day &&
            l.isLeap === lunar.isLeap
          ) {
            return { year: y, month: m, day: d };
          }
        }
      }
    }
    return null;
  },
  // 距离农历日期还有多少天
  daysToLunar(lunar) {
    const solar = lunarBiz.lunar2solar(lunar);
    const date = new Date(solar.year, solar.month - 1, solar.day);
    const now = new Date();
    return Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  },
};

// 时区工具函数
function formatBeijingTime(date = new Date(), format = "full") {
  if (format === "date") {
    return date.toLocaleDateString("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } else if (format === "datetime") {
    return date.toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } else {
    // full format
    return date.toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
    });
  }
}

// 工具函数
function generateRandomSecret() {
  // 生成一个64字符的随机密钥
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let result = "";
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// 从KV存储获取配置
async function getConfig(env) {
  try {
    if (!env.SUBSCRIPTIONS_KV) {
      console.error("[配置] KV存储未绑定");
      throw new Error("KV存储未绑定");
    }

    const data = await env.SUBSCRIPTIONS_KV.get("config");
    console.log("[配置] 从KV读取配置:", data ? "成功" : "空配置");

    const config = data ? JSON.parse(data) : {};

    // 确保JWT_SECRET的一致性
    let jwtSecret = config.JWT_SECRET;
    if (!jwtSecret || jwtSecret === "your-secret-key") {
      jwtSecret = generateRandomSecret();
      console.log("[配置] 生成新的JWT密钥");

      // 保存新的JWT密钥
      const updatedConfig = { ...config, JWT_SECRET: jwtSecret };
      await env.SUBSCRIPTIONS_KV.put("config", JSON.stringify(updatedConfig));
    }

    const finalConfig = {
      ADMIN_USERNAME: config.ADMIN_USERNAME || "admin",
      ADMIN_PASSWORD: config.ADMIN_PASSWORD || "password",
      JWT_SECRET: jwtSecret,
      TG_BOT_TOKEN: config.TG_BOT_TOKEN || "",
      TG_CHAT_ID: config.TG_CHAT_ID || "",
      NOTIFYX_API_KEY: config.NOTIFYX_API_KEY || "",
      WEBHOOK_URL: config.WEBHOOK_URL || "",
      WEBHOOK_METHOD: config.WEBHOOK_METHOD || "POST",
      WEBHOOK_HEADERS: config.WEBHOOK_HEADERS || "",
      WEBHOOK_TEMPLATE: config.WEBHOOK_TEMPLATE || "",
      SHOW_LUNAR: config.SHOW_LUNAR === true,
      WECHATBOT_WEBHOOK: config.WECHATBOT_WEBHOOK || "",
      WECHATBOT_MSG_TYPE: config.WECHATBOT_MSG_TYPE || "text",
      WECHATBOT_AT_MOBILES: config.WECHATBOT_AT_MOBILES || "",
      WECHATBOT_AT_ALL: config.WECHATBOT_AT_ALL || "false",
      RESEND_API_KEY: config.RESEND_API_KEY || "",
      EMAIL_FROM: config.EMAIL_FROM || "",
      EMAIL_FROM_NAME: config.EMAIL_FROM_NAME || "",
      EMAIL_TO: config.EMAIL_TO || "",
      ENABLED_NOTIFIERS: config.ENABLED_NOTIFIERS || ["notifyx"],
    };

    console.log("[配置] 最终配置用户名:", finalConfig.ADMIN_USERNAME);
    return finalConfig;
  } catch (error) {
    console.error("[配置] 获取配置失败:", error);
    const defaultJwtSecret = generateRandomSecret();

    return {
      ADMIN_USERNAME: "admin",
      ADMIN_PASSWORD: "password",
      JWT_SECRET: defaultJwtSecret,
      TG_BOT_TOKEN: "",
      TG_CHAT_ID: "",
      NOTIFYX_API_KEY: "",
      WEBHOOK_URL: "",
      WEBHOOK_METHOD: "POST",
      WEBHOOK_HEADERS: "",
      WEBHOOK_TEMPLATE: "",
      SHOW_LUNAR: true,
      WECHATBOT_WEBHOOK: "",
      WECHATBOT_MSG_TYPE: "text",
      WECHATBOT_AT_MOBILES: "",
      WECHATBOT_AT_ALL: "false",
      RESEND_API_KEY: "",
      EMAIL_FROM: "",
      EMAIL_FROM_NAME: "",
      EMAIL_TO: "",
      ENABLED_NOTIFIERS: ["notifyx"],
    };
  }
}

// 生成JWT
async function generateJWT(username, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = { username, iat: Math.floor(Date.now() / 1000) };

  const headerBase64 = btoa(JSON.stringify(header));
  const payloadBase64 = btoa(JSON.stringify(payload));

  const signatureInput = headerBase64 + "." + payloadBase64;
  const signature = await CryptoJS.HmacSHA256(signatureInput, secret);

  return headerBase64 + "." + payloadBase64 + "." + signature;
}

// 验证JWT
async function verifyJWT(token, secret) {
  try {
    if (!token || !secret) {
      console.log("[JWT] Token或Secret为空");
      return null;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      console.log("[JWT] Token格式错误，部分数量:", parts.length);
      return null;
    }

    const [headerBase64, payloadBase64, signature] = parts;
    const signatureInput = headerBase64 + "." + payloadBase64;
    const expectedSignature = await CryptoJS.HmacSHA256(signatureInput, secret);

    if (signature !== expectedSignature) {
      console.log("[JWT] 签名验证失败");
      return null;
    }

    const payload = JSON.parse(atob(payloadBase64));
    console.log("[JWT] 验证成功，用户:", payload.username);
    return payload;
  } catch (error) {
    console.error("[JWT] 验证过程出错:", error);
    return null;
  }
}

// 获取所有订阅
async function getAllSubscriptions(env) {
  try {
    const data = await env.SUBSCRIPTIONS_KV.get("subscriptions");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

// 获取订阅详情
async function getSubscription(id, env) {
  const subscriptions = await getAllSubscriptions(env);
  return subscriptions.find((s) => s.id === id);
}

// 创建订阅
async function createSubscription(subscription, env) {
  try {
    const subscriptions = await getAllSubscriptions(env);

    if (!subscription.name || !subscription.expiryDate) {
      return { success: false, message: "缺少必填字段" };
    }

    let expiryDate = new Date(subscription.expiryDate);
    const now = new Date();

    let useLunar = !!subscription.useLunar;
    if (useLunar) {
      let lunar = lunarCalendar.solar2lunar(
        expiryDate.getFullYear(),
        expiryDate.getMonth() + 1,
        expiryDate.getDate()
      );

      if (lunar && subscription.periodValue && subscription.periodUnit) {
        // 如果到期日<=今天，自动推算到下一个周期
        while (expiryDate <= now) {
          lunar = lunarBiz.addLunarPeriod(
            lunar,
            subscription.periodValue,
            subscription.periodUnit
          );
          const solar = lunarBiz.lunar2solar(lunar);
          expiryDate = new Date(solar.year, solar.month - 1, solar.day);
        }
        subscription.expiryDate = expiryDate.toISOString();
      }
    } else {
      if (
        expiryDate < now &&
        subscription.periodValue &&
        subscription.periodUnit
      ) {
        while (expiryDate < now) {
          if (subscription.periodUnit === "day") {
            expiryDate.setDate(expiryDate.getDate() + subscription.periodValue);
          } else if (subscription.periodUnit === "month") {
            expiryDate.setMonth(
              expiryDate.getMonth() + subscription.periodValue
            );
          } else if (subscription.periodUnit === "year") {
            expiryDate.setFullYear(
              expiryDate.getFullYear() + subscription.periodValue
            );
          }
        }
        subscription.expiryDate = expiryDate.toISOString();
      }
    }

    const newSubscription = {
      id: Date.now().toString(),
      name: subscription.name,
      customType: subscription.customType || "",
      startDate: subscription.startDate || null,
      expiryDate: subscription.expiryDate,
      periodValue: subscription.periodValue || 1,
      periodUnit: subscription.periodUnit || "month",
      reminderDays:
        subscription.reminderDays !== undefined ? subscription.reminderDays : 7,
      notes: subscription.notes || "",
      isActive: subscription.isActive !== false,
      autoRenew: subscription.autoRenew !== false,
      useLunar: useLunar, // 新增
      createdAt: new Date().toISOString(),
    };

    subscriptions.push(newSubscription);

    await env.SUBSCRIPTIONS_KV.put(
      "subscriptions",
      JSON.stringify(subscriptions)
    );

    return { success: true, subscription: newSubscription };
  } catch (error) {
    console.error("创建订阅异常：", error && error.stack ? error.stack : error);
    return {
      success: false,
      message: error && error.message ? error.message : "创建订阅失败",
    };
  }
}

// 更新订阅
async function updateSubscription(id, subscription, env) {
  try {
    const subscriptions = await getAllSubscriptions(env);
    const index = subscriptions.findIndex((s) => s.id === id);

    if (index === -1) {
      return { success: false, message: "订阅不存在" };
    }

    if (!subscription.name || !subscription.expiryDate) {
      return { success: false, message: "缺少必填字段" };
    }

    let expiryDate = new Date(subscription.expiryDate);
    const now = new Date();

    let useLunar = !!subscription.useLunar;
    if (useLunar) {
      let lunar = lunarCalendar.solar2lunar(
        expiryDate.getFullYear(),
        expiryDate.getMonth() + 1,
        expiryDate.getDate()
      );
      if (!lunar) {
        return {
          success: false,
          message: "农历日期超出支持范围（1900-2100年）",
        };
      }
      if (
        lunar &&
        expiryDate < now &&
        subscription.periodValue &&
        subscription.periodUnit
      ) {
        // 新增：循环加周期，直到 expiryDate > now
        do {
          lunar = lunarBiz.addLunarPeriod(
            lunar,
            subscription.periodValue,
            subscription.periodUnit
          );
          const solar = lunarBiz.lunar2solar(lunar);
          expiryDate = new Date(solar.year, solar.month - 1, solar.day);
        } while (expiryDate < now);
        subscription.expiryDate = expiryDate.toISOString();
      }
    } else {
      if (
        expiryDate < now &&
        subscription.periodValue &&
        subscription.periodUnit
      ) {
        while (expiryDate < now) {
          if (subscription.periodUnit === "day") {
            expiryDate.setDate(expiryDate.getDate() + subscription.periodValue);
          } else if (subscription.periodUnit === "month") {
            expiryDate.setMonth(
              expiryDate.getMonth() + subscription.periodValue
            );
          } else if (subscription.periodUnit === "year") {
            expiryDate.setFullYear(
              expiryDate.getFullYear() + subscription.periodValue
            );
          }
        }
        subscription.expiryDate = expiryDate.toISOString();
      }
    }

    subscriptions[index] = {
      ...subscriptions[index],
      name: subscription.name,
      customType:
        subscription.customType || subscriptions[index].customType || "",
      startDate: subscription.startDate || subscriptions[index].startDate,
      expiryDate: subscription.expiryDate,
      periodValue:
        subscription.periodValue || subscriptions[index].periodValue || 1,
      periodUnit:
        subscription.periodUnit || subscriptions[index].periodUnit || "month",
      reminderDays:
        subscription.reminderDays !== undefined
          ? subscription.reminderDays
          : subscriptions[index].reminderDays !== undefined
          ? subscriptions[index].reminderDays
          : 7,
      notes: subscription.notes || "",
      isActive:
        subscription.isActive !== undefined
          ? subscription.isActive
          : subscriptions[index].isActive,
      autoRenew:
        subscription.autoRenew !== undefined
          ? subscription.autoRenew
          : subscriptions[index].autoRenew !== undefined
          ? subscriptions[index].autoRenew
          : true,
      useLunar: useLunar, // 新增
      updatedAt: new Date().toISOString(),
    };

    await env.SUBSCRIPTIONS_KV.put(
      "subscriptions",
      JSON.stringify(subscriptions)
    );

    return { success: true, subscription: subscriptions[index] };
  } catch (error) {
    return { success: false, message: "更新订阅失败" };
  }
}

// 删除订阅
async function deleteSubscription(id, env) {
  try {
    const subscriptions = await getAllSubscriptions(env);
    const filteredSubscriptions = subscriptions.filter((s) => s.id !== id);

    if (filteredSubscriptions.length === subscriptions.length) {
      return { success: false, message: "订阅不存在" };
    }

    await env.SUBSCRIPTIONS_KV.put(
      "subscriptions",
      JSON.stringify(filteredSubscriptions)
    );

    return { success: true };
  } catch (error) {
    return { success: false, message: "删除订阅失败" };
  }
}

// 切换订阅状态
async function toggleSubscriptionStatus(id, isActive, env) {
  try {
    const subscriptions = await getAllSubscriptions(env);
    const index = subscriptions.findIndex((s) => s.id === id);

    if (index === -1) {
      return { success: false, message: "订阅不存在" };
    }

    subscriptions[index] = {
      ...subscriptions[index],
      isActive: isActive,
      updatedAt: new Date().toISOString(),
    };

    await env.SUBSCRIPTIONS_KV.put(
      "subscriptions",
      JSON.stringify(subscriptions)
    );

    return { success: true, subscription: subscriptions[index] };
  } catch (error) {
    return { success: false, message: "更新订阅状态失败" };
  }
}

// 手动测试订阅通知
async function testSingleSubscriptionNotification(id, env) {
  try {
    const subscription = await getSubscription(id, env);
    if (!subscription) {
      return { success: false, message: "未找到该订阅" };
    }
    const config = await getConfig(env);

    const title = `手动测试通知: ${subscription.name}`;

    // 检查是否显示农历（从配置中获取，默认不显示）
    const showLunar = config.SHOW_LUNAR === true;
    let lunarExpiryText = "";

    if (showLunar) {
      // 计算农历日期
      const expiryDateObj = new Date(subscription.expiryDate);
      const lunarExpiry = lunarCalendar.solar2lunar(
        expiryDateObj.getFullYear(),
        expiryDateObj.getMonth() + 1,
        expiryDateObj.getDate()
      );
      lunarExpiryText = lunarExpiry ? ` (农历: ${lunarExpiry.fullStr})` : "";
    }

    const commonContent = `**订阅详情**:\n- **类型**: ${
      subscription.customType || "其他"
    }\n- **到期日**: ${formatBeijingTime(
      new Date(subscription.expiryDate),
      "date"
    )}${lunarExpiryText}\n- **备注**: ${subscription.notes || "无"}`;

    // 使用多渠道发送
    await sendNotificationToAllChannels(
      title,
      commonContent,
      config,
      "[手动测试]"
    );

    return { success: true, message: "测试通知已发送到所有启用的渠道" };
  } catch (error) {
    console.error("[手动测试] 发送失败:", error);
    return { success: false, message: "发送时发生错误: " + error.message };
  }
}

// 发送企业微信应用通知
async function sendWebhookNotification(title, content, config) {
  try {
    if (!config.WEBHOOK_URL) {
      console.error("[企业微信应用通知] 通知未配置，缺少URL");
      return false;
    }

    console.log("[企业微信应用通知] 开始发送通知到: " + config.WEBHOOK_URL);

    const timestamp = formatBeijingTime(new Date(), "datetime");
    let requestBody;
    let headers = { "Content-Type": "application/json" };

    // 处理自定义请求头
    if (config.WEBHOOK_HEADERS) {
      try {
        const customHeaders = JSON.parse(config.WEBHOOK_HEADERS);
        headers = { ...headers, ...customHeaders };
      } catch (error) {
        console.warn("[企业微信应用通知] 自定义请求头格式错误，使用默认请求头");
      }
    }

    // 处理消息模板
    if (config.WEBHOOK_TEMPLATE) {
      try {
        const template = JSON.parse(config.WEBHOOK_TEMPLATE);
        requestBody = JSON.stringify(template)
          .replace(/\{\{title\}\}/g, title)
          .replace(/\{\{content\}\}/g, content)
          .replace(/\{\{timestamp\}\}/g, timestamp);
        requestBody = JSON.parse(requestBody);
      } catch (error) {
        console.warn("[企业微信应用通知] 消息模板格式错误，使用默认格式");
        requestBody = { title, content, timestamp };
      }
    } else {
      requestBody = { title, content, timestamp };
    }

    const response = await fetch(config.WEBHOOK_URL, {
      method: config.WEBHOOK_METHOD || "POST",
      headers: headers,
      body: JSON.stringify(requestBody),
    });

    const result = await response.text();
    console.log("[企业微信应用通知] 发送结果:", response.status, result);
    return response.ok;
  } catch (error) {
    console.error("[企业微信应用通知] 发送通知失败:", error);
    return false;
  }
}

// 发送企业微信机器人通知
async function sendWechatBotNotification(title, content, config) {
  try {
    if (!config.WECHATBOT_WEBHOOK) {
      console.error("[企业微信机器人] 通知未配置，缺少Webhook URL");
      return false;
    }

    console.log("[企业微信机器人] 开始发送通知到: " + config.WECHATBOT_WEBHOOK);

    // 构建消息内容
    let messageData;
    const msgType = config.WECHATBOT_MSG_TYPE || "text";

    if (msgType === "markdown") {
      // Markdown 消息格式
      const markdownContent = `# ${title}\n\n${content}`;
      messageData = {
        msgtype: "markdown",
        markdown: {
          content: markdownContent,
        },
      };
    } else {
      // 文本消息格式
      const textContent = `${title}\n\n${content}`;
      messageData = {
        msgtype: "text",
        text: {
          content: textContent,
        },
      };
    }

    // 处理@功能
    if (config.WECHATBOT_AT_ALL === "true") {
      // @所有人
      if (msgType === "text") {
        messageData.text.mentioned_list = ["@all"];
      }
    } else if (config.WECHATBOT_AT_MOBILES) {
      // @指定手机号
      const mobiles = config.WECHATBOT_AT_MOBILES.split(",")
        .map((m) => m.trim())
        .filter((m) => m);
      if (mobiles.length > 0) {
        if (msgType === "text") {
          messageData.text.mentioned_mobile_list = mobiles;
        }
      }
    }

    console.log(
      "[企业微信机器人] 发送消息数据:",
      JSON.stringify(messageData, null, 2)
    );

    const response = await fetch(config.WECHATBOT_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    });

    const responseText = await response.text();
    console.log("[企业微信机器人] 响应状态:", response.status);
    console.log("[企业微信机器人] 响应内容:", responseText);

    if (response.ok) {
      try {
        const result = JSON.parse(responseText);
        if (result.errcode === 0) {
          console.log("[企业微信机器人] 通知发送成功");
          return true;
        } else {
          console.error(
            "[企业微信机器人] 发送失败，错误码:",
            result.errcode,
            "错误信息:",
            result.errmsg
          );
          return false;
        }
      } catch (parseError) {
        console.error("[企业微信机器人] 解析响应失败:", parseError);
        return false;
      }
    } else {
      console.error("[企业微信机器人] HTTP请求失败，状态码:", response.status);
      return false;
    }
  } catch (error) {
    console.error("[企业微信机器人] 发送通知失败:", error);
    return false;
  }
}

// 发送通知到所有启用的渠道
async function sendNotificationToAllChannels(
  title,
  commonContent,
  config,
  logPrefix = "[定时任务]"
) {
  if (!config.ENABLED_NOTIFIERS || config.ENABLED_NOTIFIERS.length === 0) {
    console.log(`${logPrefix} 未启用任何通知渠道。`);
    return;
  }

  if (config.ENABLED_NOTIFIERS.includes("notifyx")) {
    const notifyxContent = `## ${title}\n\n${commonContent}`;
    const success = await sendNotifyXNotification(
      title,
      notifyxContent,
      `订阅提醒`,
      config
    );
    console.log(`${logPrefix} 发送NotifyX通知 ${success ? "成功" : "失败"}`);
  }
  if (config.ENABLED_NOTIFIERS.includes("telegram")) {
    const telegramContent = `*${title}*\n\n${commonContent.replace(
      /(\s)/g,
      " "
    )}`;
    const success = await sendTelegramNotification(telegramContent, config);
    console.log(`${logPrefix} 发送Telegram通知 ${success ? "成功" : "失败"}`);
  }
  if (config.ENABLED_NOTIFIERS.includes("webhook")) {
    const webhookContent = commonContent.replace(/(\**|\*|##|#|`)/g, "");
    const success = await sendWebhookNotification(
      title,
      webhookContent,
      config
    );
    console.log(
      `${logPrefix} 发送企业微信应用通知 ${success ? "成功" : "失败"}`
    );
  }
  if (config.ENABLED_NOTIFIERS.includes("wechatbot")) {
    const wechatbotContent = commonContent.replace(/(\**|\*|##|#|`)/g, "");
    const success = await sendWechatBotNotification(
      title,
      wechatbotContent,
      config
    );
    console.log(
      `${logPrefix} 发送企业微信机器人通知 ${success ? "成功" : "失败"}`
    );
  }
  if (config.ENABLED_NOTIFIERS.includes("weixin")) {
    const weixinContent = `【${title}】\n\n${commonContent.replace(
      /(\**|\*|##|#|`)/g,
      ""
    )}`;
    const result = await sendWeComNotification(weixinContent, config);
    console.log(
      `${logPrefix} 发送企业微信通知 ${result.success ? "成功" : "失败"}. ${
        result.message
      }`
    );
  }
  if (config.ENABLED_NOTIFIERS.includes("email")) {
    const emailContent = commonContent.replace(/(\**|\*|##|#|`)/g, "");
    const success = await sendEmailNotification(title, emailContent, config);
    console.log(`${logPrefix} 发送邮件通知 ${success ? "成功" : "失败"}`);
  }
}

// 发送Telegram通知
async function sendTelegramNotification(message, config) {
  try {
    if (!config.TG_BOT_TOKEN || !config.TG_CHAT_ID) {
      console.error("[Telegram] 通知未配置，缺少Bot Token或Chat ID");
      return false;
    }

    console.log("[Telegram] 开始发送通知到 Chat ID: " + config.TG_CHAT_ID);

    const url =
      "https://api.telegram.org/bot" + config.TG_BOT_TOKEN + "/sendMessage";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.TG_CHAT_ID,
        text: message,
        parse_mode: "Markdown",
      }),
    });

    const result = await response.json();
    console.log("[Telegram] 发送结果:", result);
    return result.ok;
  } catch (error) {
    console.error("[Telegram] 发送通知失败:", error);
    return false;
  }
}

// 发送NotifyX通知
async function sendNotifyXNotification(title, content, description, config) {
  try {
    if (!config.NOTIFYX_API_KEY) {
      console.error("[NotifyX] 通知未配置，缺少API Key");
      return false;
    }

    console.log("[NotifyX] 开始发送通知: " + title);

    const url = "https://www.notifyx.cn/api/v1/send/" + config.NOTIFYX_API_KEY;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        content: content,
        description: description || "",
      }),
    });

    const result = await response.json();
    console.log("[NotifyX] 发送结果:", result);
    return result.status === "queued";
  } catch (error) {
    console.error("[NotifyX] 发送通知失败:", error);
    return false;
  }
}

// 发送邮件通知
async function sendEmailNotification(title, content, config) {
  try {
    if (!config.RESEND_API_KEY || !config.EMAIL_FROM || !config.EMAIL_TO) {
      console.error("[邮件通知] 通知未配置，缺少必要参数");
      return false;
    }

    console.log("[邮件通知] 开始发送邮件到: " + config.EMAIL_TO);

    // 生成HTML邮件内容
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: white; margin: 0; font-size: 24px; }
        .content { padding: 30px 20px; }
        .content h2 { color: #333; margin-top: 0; }
        .content p { color: #666; line-height: 1.6; margin: 16px 0; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .highlight { background-color: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📅 ${title}</h1>
        </div>
        <div class="content">
            <div class="highlight">
                ${content.replace(/\n/g, "<br>")}
            </div>
            <p>此邮件由订阅管理系统自动发送，请及时处理相关订阅事务。</p>
        </div>
        <div class="footer">
            <p>订阅管理系统 | 发送时间: ${formatBeijingTime()}</p>
        </div>
    </div>
</body>
</html>`;

    const fromEmail = config.EMAIL_FROM_NAME
      ? `${config.EMAIL_FROM_NAME} <${config.EMAIL_FROM}>`
      : config.EMAIL_FROM;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: config.EMAIL_TO,
        subject: title,
        html: htmlContent,
        text: content, // 纯文本备用
      }),
    });

    const result = await response.json();
    console.log("[邮件通知] 发送结果:", response.status, result);

    if (response.ok && result.id) {
      console.log("[邮件通知] 邮件发送成功，ID:", result.id);
      return true;
    } else {
      console.error("[邮件通知] 邮件发送失败:", result);
      return false;
    }
  } catch (error) {
    console.error("[邮件通知] 发送邮件失败:", error);
    return false;
  }
}

// 发送通知
async function sendNotification(title, content, description, config) {
  if (config.NOTIFICATION_TYPE === "notifyx") {
    return await sendNotifyXNotification(title, content, description, config);
  } else {
    return await sendTelegramNotification(content, config);
  }
}

// 发送通知
async function sendNotification(title, content, description, config) {
  if (config.NOTIFICATION_TYPE === "notifyx") {
    return await sendNotifyXNotification(title, content, description, config);
  } else {
    return await sendTelegramNotification(content, config);
  }
}

// 检查即将到期的订阅
async function checkExpiringSubscriptions(env) {
  try {
    const now = new Date();
    const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    console.log(
      "[定时任务] 开始检查即将到期的订阅 UTC: " +
        now.toISOString() +
        ", 北京时间: " +
        beijingTime.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })
    );

    const subscriptions = await getAllSubscriptions(env);
    console.log("[定时任务] 共找到 " + subscriptions.length + " 个订阅");

    const config = await getConfig(env);
    const expiringSubscriptions = [];
    const updatedSubscriptions = [];
    let hasUpdates = false;

    for (const subscription of subscriptions) {
      if (subscription.isActive === false) {
        console.log('[定时任务] 订阅 "' + subscription.name + '" 已停用，跳过');
        continue;
      }

      let daysDiff;
      if (subscription.useLunar) {
        const expiryDate = new Date(subscription.expiryDate);
        let lunar = lunarCalendar.solar2lunar(
          expiryDate.getFullYear(),
          expiryDate.getMonth() + 1,
          expiryDate.getDate()
        );
        daysDiff = lunarBiz.daysToLunar(lunar);

        console.log(
          '[定时任务] 订阅 "' +
            subscription.name +
            '" 到期日期: ' +
            expiryDate.toISOString() +
            ", 剩余天数: " +
            daysDiff
        );

        if (
          daysDiff < 0 &&
          subscription.periodValue &&
          subscription.periodUnit &&
          subscription.autoRenew !== false
        ) {
          let nextLunar = lunar;
          do {
            nextLunar = lunarBiz.addLunarPeriod(
              nextLunar,
              subscription.periodValue,
              subscription.periodUnit
            );
            const solar = lunarBiz.lunar2solar(nextLunar);
            var newExpiryDate = new Date(
              solar.year,
              solar.month - 1,
              solar.day
            );
            daysDiff = lunarBiz.daysToLunar(nextLunar);
            console.log(
              '[定时任务] 订阅 "' +
                subscription.name +
                '" 更新到期日期: ' +
                newExpiryDate.toISOString() +
                ", 剩余天数: " +
                daysDiff
            );
          } while (daysDiff < 0);

          const updatedSubscription = {
            ...subscription,
            expiryDate: newExpiryDate.toISOString(),
          };
          updatedSubscriptions.push(updatedSubscription);
          hasUpdates = true;

          let reminderDays =
            subscription.reminderDays !== undefined
              ? subscription.reminderDays
              : 7;
          let shouldRemindAfterRenewal = false;
          if (reminderDays === 0) {
            shouldRemindAfterRenewal = daysDiff === 0;
          } else {
            shouldRemindAfterRenewal =
              daysDiff >= 0 && daysDiff <= reminderDays;
          }
          if (shouldRemindAfterRenewal) {
            console.log(
              '[定时任务] 订阅 "' +
                subscription.name +
                '" 在提醒范围内，将发送通知'
            );
            expiringSubscriptions.push({
              ...updatedSubscription,
              daysRemaining: daysDiff,
            });
          }
          continue;
        }
      } else {
        const expiryDate = new Date(subscription.expiryDate);
        daysDiff = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));

        console.log(
          '[定时任务] 订阅 "' +
            subscription.name +
            '" 到期日期: ' +
            expiryDate.toISOString() +
            ", 剩余天数: " +
            daysDiff
        );

        if (
          daysDiff < 0 &&
          subscription.periodValue &&
          subscription.periodUnit &&
          subscription.autoRenew !== false
        ) {
          const newExpiryDate = new Date(expiryDate);

          if (subscription.periodUnit === "day") {
            newExpiryDate.setDate(
              expiryDate.getDate() + subscription.periodValue
            );
          } else if (subscription.periodUnit === "month") {
            newExpiryDate.setMonth(
              expiryDate.getMonth() + subscription.periodValue
            );
          } else if (subscription.periodUnit === "year") {
            newExpiryDate.setFullYear(
              expiryDate.getFullYear() + subscription.periodValue
            );
          }

          while (newExpiryDate < now) {
            console.log(
              "[定时任务] 新计算的到期日期 " +
                newExpiryDate.toISOString() +
                " 仍然过期，继续计算下一个周期"
            );
            if (subscription.periodUnit === "day") {
              newExpiryDate.setDate(
                newExpiryDate.getDate() + subscription.periodValue
              );
            } else if (subscription.periodUnit === "month") {
              newExpiryDate.setMonth(
                newExpiryDate.getMonth() + subscription.periodValue
              );
            } else if (subscription.periodUnit === "year") {
              newExpiryDate.setFullYear(
                newExpiryDate.getFullYear() + subscription.periodValue
              );
            }
          }

          console.log(
            '[定时任务] 订阅 "' +
              subscription.name +
              '" 更新到期日期: ' +
              newExpiryDate.toISOString()
          );

          const updatedSubscription = {
            ...subscription,
            expiryDate: newExpiryDate.toISOString(),
          };
          updatedSubscriptions.push(updatedSubscription);
          hasUpdates = true;

          const newDaysDiff = Math.ceil(
            (newExpiryDate - now) / (1000 * 60 * 60 * 24)
          );
          let reminderDays =
            subscription.reminderDays !== undefined
              ? subscription.reminderDays
              : 7;
          let shouldRemindAfterRenewal = false;
          if (reminderDays === 0) {
            shouldRemindAfterRenewal = newDaysDiff === 0;
          } else {
            shouldRemindAfterRenewal =
              newDaysDiff >= 0 && newDaysDiff <= reminderDays;
          }
          if (shouldRemindAfterRenewal) {
            console.log(
              '[定时任务] 订阅 "' +
                subscription.name +
                '" 在提醒范围内，将发送通知'
            );
            expiringSubscriptions.push({
              ...updatedSubscription,
              daysRemaining: newDaysDiff,
            });
          }
          continue;
        }
      }

      const reminderDays =
        subscription.reminderDays !== undefined ? subscription.reminderDays : 7;
      let shouldRemind = false;
      if (reminderDays === 0) {
        shouldRemind = daysDiff === 0;
      } else {
        shouldRemind = daysDiff >= 0 && daysDiff <= reminderDays;
      }

      if (daysDiff < 0 && subscription.autoRenew === false) {
        console.log(
          '[定时任务] 订阅 "' +
            subscription.name +
            '" 已过期且未启用自动续订，将发送过期通知'
        );
        expiringSubscriptions.push({
          ...subscription,
          daysRemaining: daysDiff,
        });
      } else if (shouldRemind) {
        console.log(
          '[定时任务] 订阅 "' + subscription.name + '" 在提醒范围内，将发送通知'
        );
        expiringSubscriptions.push({
          ...subscription,
          daysRemaining: daysDiff,
        });
      }
    }

    if (hasUpdates) {
      const mergedSubscriptions = subscriptions.map((sub) => {
        const updated = updatedSubscriptions.find((u) => u.id === sub.id);
        return updated || sub;
      });
      await env.SUBSCRIPTIONS_KV.put(
        "subscriptions",
        JSON.stringify(mergedSubscriptions)
      );
    }

    if (expiringSubscriptions.length > 0) {
      let commonContent = "";
      expiringSubscriptions.sort((a, b) => a.daysRemaining - b.daysRemaining);

      const showLunar = config.SHOW_LUNAR === true;

      for (const sub of expiringSubscriptions) {
        const typeText = sub.customType || "其他";
        const periodText =
          sub.periodValue && sub.periodUnit
            ? `(周期: ${sub.periodValue} ${
                { day: "天", month: "月", year: "年" }[sub.periodUnit] ||
                sub.periodUnit
              })`
            : "";

        let lunarExpiryText = "";
        if (showLunar) {
          const expiryDateObj = new Date(sub.expiryDate);
          const lunarExpiry = lunarCalendar.solar2lunar(
            expiryDateObj.getFullYear(),
            expiryDateObj.getMonth() + 1,
            expiryDateObj.getDate()
          );
          lunarExpiryText = lunarExpiry
            ? ` (农历: ${lunarExpiry.fullStr})`
            : "";
        }

        let statusText;
        if (sub.daysRemaining === 0)
          statusText = `⚠️ **${sub.name}** (${typeText}) ${periodText} 今天到期！${lunarExpiryText}`;
        else if (sub.daysRemaining < 0)
          statusText = `🚨 **${
            sub.name
          }** (${typeText}) ${periodText} 已过期 ${Math.abs(
            sub.daysRemaining
          )} 天${lunarExpiryText}`;
        else
          statusText = `📅 **${sub.name}** (${typeText}) ${periodText} 将在 ${sub.daysRemaining} 天后到期${lunarExpiryText}`;

        if (sub.notes) statusText += `\n   备注: ${sub.notes}`;
        commonContent += statusText + "\n\n";
      }

      const title = "订阅到期提醒";
      await sendNotificationToAllChannels(
        title,
        commonContent,
        config,
        "[定时任务]"
      );
    }
  } catch (error) {
    console.error("[定时任务] 检查即将到期的订阅失败:", error);
  }
}

// 获取Cookie值
function getCookieValue(cookieString, key) {
  if (!cookieString) return null;

  const match = cookieString.match(new RegExp("(^| )" + key + "=([^;]+)"));
  return match ? match[2] : null;
}

// 处理请求
async function handleRequest(request, env, ctx) {
  return new Response(loginPage, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

// 加密函数
const CryptoJS = {
  HmacSHA256: function (message, key) {
    const keyData = new TextEncoder().encode(key);
    const messageData = new TextEncoder().encode(message);

    return Promise.resolve()
      .then(() => {
        return crypto.subtle.importKey(
          "raw",
          keyData,
          { name: "HMAC", hash: { name: "SHA-256" } },
          false,
          ["sign"]
        );
      })
      .then((cryptoKey) => {
        return crypto.subtle.sign("HMAC", cryptoKey, messageData);
      })
      .then((buffer) => {
        const hashArray = Array.from(new Uint8Array(buffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      });
  },
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 添加调试页面
    if (url.pathname === "/debug") {
      try {
        const config = await getConfig(env);
        const debugInfo = {
          timestamp: new Date().toISOString(),
          pathname: url.pathname,
          kvBinding: !!env.SUBSCRIPTIONS_KV,
          configExists: !!config,
          adminUsername: config.ADMIN_USERNAME,
          hasJwtSecret: !!config.JWT_SECRET,
          jwtSecretLength: config.JWT_SECRET ? config.JWT_SECRET.length : 0,
        };

        return new Response(
          `
<!DOCTYPE html>
<html>
  <head>
    <title>调试信息</title>
    <style>
      body { font-family: monospace; padding: 20px; background: #f5f5f5; }
      .info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
      .success { color: green; }
      .error { color: red; }
    </style>
  </head>
  <body>
    <h1>系统调试信息</h1>
    <div class="info">
      <h3>基本信息</h3>
      <p>时间: ${debugInfo.timestamp}</p>
      <p>路径: ${debugInfo.pathname}</p>
      <p class="${debugInfo.kvBinding ? "success" : "error"}">KV绑定: ${
            debugInfo.kvBinding ? "✓" : "✗"
          }</p>
    </div>

    <div class="info">
      <h3>配置信息</h3>
      <p class="${debugInfo.configExists ? "success" : "error"}">配置存在: ${
            debugInfo.configExists ? "✓" : "✗"
          }</p>
      <p>管理员用户名: ${debugInfo.adminUsername}</p>
      <p class="${debugInfo.hasJwtSecret ? "success" : "error"}">JWT密钥: ${
            debugInfo.hasJwtSecret ? "✓" : "✗"
          } (长度: ${debugInfo.jwtSecretLength})</p>
    </div>

    <div class="info">
      <h3>解决方案</h3>
      <p>1. 确保KV命名空间已正确绑定为 SUBSCRIPTIONS_KV</p>
      <p>2. 尝试访问 <a href="/">/</a> 进行登录</p>
      <p>3. 如果仍有问题，请检查Cloudflare Workers日志</p>
    </div>
  </body>
</html>`,
          {
            headers: { "Content-Type": "text/html; charset=utf-8" },
          }
        );
      } catch (error) {
        return new Response(`调试页面错误: ${error.message}`, {
          status: 500,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }
    }

    if (url.pathname.startsWith("/api")) {
      return api.handleRequest(request, env, ctx);
    } else if (url.pathname.startsWith("/admin")) {
      return admin.handleRequest(request, env, ctx);
    } else {
      return handleRequest(request, env, ctx);
    }
  },

  async scheduled(event, env, ctx) {
    const now = new Date();
    const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    console.log(
      "[Workers] 定时任务触发 UTC:",
      now.toISOString(),
      "北京时间:",
      beijingTime.toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })
    );
    await checkExpiringSubscriptions(env);
  },
};
