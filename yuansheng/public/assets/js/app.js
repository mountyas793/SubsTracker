// 订阅管理应用主脚本 - 单文件版本
class SubscriptionManager {
  constructor() {
    this.subscriptions =
      JSON.parse(localStorage.getItem("subscriptions")) || [];
    this.init();
  }

  init() {
    this.bindEvents();
    this.renderSubscriptions();
    this.updateStats();
    this.loadSubscriptions();
  }

  bindEvents() {
    // 弹窗控制
    const addSubBtn = document.getElementById("addSubBtn");
    const addQuickBtn = document.getElementById("addQuickBtn");

    if (addSubBtn) addSubBtn.addEventListener("click", () => this.openModal());
    if (addQuickBtn)
      addQuickBtn.addEventListener("click", () => this.openModal());

    const modalOverlay = document.querySelector(".modal-overlay");
    if (modalOverlay) {
      modalOverlay.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal-overlay")) this.closeModal();
      });
    }

    const cancelBtn = document.getElementById("cancelBtn");
    if (cancelBtn) cancelBtn.addEventListener("click", () => this.closeModal());

    // 注销按钮
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", () => this.logout());

    // 表单提交
    const subscriptionForm = document.getElementById("subscriptionForm");
    if (subscriptionForm) {
      subscriptionForm.addEventListener("submit", (e) => this.handleSubmit(e));
    }
  }

  openModal() {
    const modalOverlay = document.querySelector(".modal-overlay");
    if (modalOverlay) modalOverlay.style.display = "flex";
  }

  closeModal() {
    const modalOverlay = document.querySelector(".modal-overlay");
    if (modalOverlay) {
      modalOverlay.style.display = "none";
      const subscriptionForm = document.getElementById("subscriptionForm");
      if (subscriptionForm) subscriptionForm.reset();
    }
  }

  handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const subscription = {
      id: Date.now(),
      name: formData.get("name"),
      price: parseFloat(formData.get("price")),
      cycle: formData.get("cycle"),
      nextBilling: formData.get("nextBilling"),
      category: formData.get("category"),
      description: formData.get("description"),
      active: true,
    };

    this.subscriptions.push(subscription);
    this.saveSubscriptions();
    this.renderSubscriptions();
    this.updateStats();
    this.closeModal();
    this.showToast("Subscription added successfully!", "success");
  }

  // 渲染订阅列表
  renderSubscriptions() {
    const container = document.getElementById("subscriptionsList");
    if (!container) return;

    container.innerHTML = "";

    if (this.subscriptions.length === 0) {
      container.innerHTML =
        '<p style="text-align: center; opacity: 0.7;">暂无订阅，点击添加按钮开始管理</p>';
      return;
    }

    this.subscriptions.forEach((sub) => {
      const div = document.createElement("div");
      div.className = "sub-content";
      div.innerHTML = `
        <div>
          <strong>${sub.name}</strong>
          <br>
          <small>${sub.category}</small>
        </div>
        <div>
          <span>¥${sub.price}/${sub.cycle}</span>
          <button class="btn" onclick="subscriptionManager.deleteSubscription(${sub.id})" style="margin-left: 0.5rem; padding: 0.4rem 0.8rem; font-size: 0.8rem;">删除</button>
        </div>
      `;
      container.appendChild(div);
    });
  }

  updateStats() {
    const totalSubs = document.getElementById("totalSubs");
    const totalCost = document.getElementById("totalCost");
    const monthlyCost = document.getElementById("monthlyCost");
    const yearlyCost = document.getElementById("yearlyCost");

    if (!totalSubs || !totalCost || !monthlyCost || !yearlyCost) return;

    const total = this.subscriptions.reduce((sum, sub) => sum + sub.price, 0);
    const monthly = this.subscriptions
      .filter((sub) => sub.cycle === "month")
      .reduce((sum, sub) => sum + sub.price, 0);
    const yearly = this.subscriptions
      .filter((sub) => sub.cycle === "year")
      .reduce((sum, sub) => sum + sub.price, 0);

    totalSubs.textContent = this.subscriptions.length;
    totalCost.textContent = `¥${total.toFixed(2)}`;
    monthlyCost.textContent = `¥${monthly.toFixed(2)}`;
    yearlyCost.textContent = `¥${yearly.toFixed(2)}`;
  }

  // 删除订阅
  deleteSubscription(id) {
    if (confirm("确定要删除这个订阅吗？")) {
      this.subscriptions = this.subscriptions.filter((sub) => sub.id !== id);
      this.saveSubscriptions();
      this.renderSubscriptions();
      this.updateStats();
      this.showToast("Subscription deleted successfully!", "info");
    }
  }

  // 保存订阅数据
  saveSubscriptions() {
    localStorage.setItem("subscriptions", JSON.stringify(this.subscriptions));
  }

  // 加载订阅数据
  loadSubscriptions() {
    // 加载示例数据（如果没有数据）
    if (this.subscriptions.length === 0) {
      const sampleData = [
        {
          id: 1,
          name: "Netflix",
          price: 28,
          cycle: "month",
          nextBilling: "2024-01-15",
          category: "娱乐",
          description: "流媒体视频服务",
          active: true,
        },
        {
          id: 2,
          name: "Spotify",
          price: 15,
          cycle: "month",
          nextBilling: "2024-01-20",
          category: "音乐",
          description: "音乐流媒体服务",
          active: true,
        },
      ];
      this.subscriptions = sampleData;
      this.saveSubscriptions();
    }
  }

  // 显示提示信息
  showToast(message, type = "info") {
    const toastContainer =
      document.getElementById("toastContainer") || this.createToastContainer();

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // 创建提示容器
  createToastContainer() {
    const container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
    return container;
  }

  // 注销功能
  logout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) logoutBtn.addEventListener("click", () => this.logout());
    // 清除登录状态
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");

    // 显示提示信息
    this.showToast("已成功退出登录", "info");

    // 切换到登录页面
    const loginPage = document.getElementById("loginPage");
    const mainContent = document.querySelector(".main-content");

    if (loginPage) loginPage.style.display = "flex";
    if (mainContent) mainContent.style.display = "none";

    // 清空用户名输入框
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    if (usernameInput) usernameInput.value = "";
    if (passwordInput) passwordInput.value = "";

    console.log("注销功能已触发");
  }
}

// 创建全局实例
window.subscriptionManager = new SubscriptionManager();

// 全局logout函数（兼容HTML onclick调用）
function logout() {
  subscriptionManager.logout();
}
