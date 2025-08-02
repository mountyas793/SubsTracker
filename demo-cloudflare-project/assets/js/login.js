// Login module
class LoginManager {
  constructor() {
    this.form = document.getElementById('loginForm');
    this.usernameInput = document.getElementById('username');
    this.passwordInput = document.getElementById('password');
    this.errorMsg = document.getElementById('errorMsg');
    this.submitButton = null;
    
    this.init();
  }

  init() {
    if (this.form) {
      this.submitButton = this.form.querySelector('button[type="submit"]');
      this.bindEvents();
    }
  }

  bindEvents() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    
    // Clear error message when user starts typing
    [this.usernameInput, this.passwordInput].forEach(input => {
      input?.addEventListener('input', this.clearError.bind(this));
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    
    const username = this.usernameInput?.value?.trim();
    const password = this.passwordInput?.value?.trim();

    if (!username || !password) {
      this.showError('Please enter both username and password');
      return;
    }

    this.setLoadingState(true);
    this.clearError();

    try {
      const response = await this.performLogin(username, password);
      
      if (response.success) {
        this.handleLoginSuccess();
      } else {
        this.showError(response.message || 'Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showError('An error occurred, please try again later');
    } finally {
      this.setLoadingState(false);
    }
  }

  async performLogin(username, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  handleLoginSuccess() {
    // Redirect to admin page on successful login
    window.location.href = '/admin';
  }

  setLoadingState(isLoading) {
    if (this.submitButton) {
      const originalContent = this.submitButton.dataset.originalContent || 
        '<i class="fas fa-sign-in-alt mr-2"></i>Sign in';

      if (isLoading) {
        // Store original content
        this.submitButton.dataset.originalContent = this.submitButton.innerHTML;
        this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Signing in...';
        this.submitButton.disabled = true;
      } else {
        this.submitButton.innerHTML = this.submitButton.dataset.originalContent || originalContent;
        this.submitButton.disabled = false;
      }
    }
  }

  showError(message) {
    if (this.errorMsg) {
      this.errorMsg.textContent = message;
      this.errorMsg.classList.remove('hidden');
      this.errorMsg.classList.add('visible');
    }
  }

  clearError() {
    if (this.errorMsg) {
      this.errorMsg.textContent = '';
      this.errorMsg.classList.remove('visible');
      this.errorMsg.classList.add('hidden');
    }
  }

  // Utility method for validation
  validateInput(input) {
    const value = input?.value?.trim();
    if (!value) {
      input?.classList?.add('error');
      return false;
    }
    input?.classList?.remove('error');
    return true;
  }
}

// Initialize login manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new LoginManager();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LoginManager;
}