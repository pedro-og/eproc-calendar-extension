// eProc Calendar - Shared Utilities

/**
 * Shows a toast notification on the page.
 * @param {string} message - The message to display
 * @param {'success'|'error'} type - The type of toast
 */
function showToast(message, type) {
  const toast = document.createElement('div');
  toast.className = 'eproc-toast eproc-toast--' + type;
  toast.textContent = message;
  document.body.appendChild(toast);

  // Trigger reflow to enable transition
  toast.offsetHeight;
  toast.classList.add('eproc-toast--visible');

  setTimeout(function () {
    toast.classList.remove('eproc-toast--visible');
    toast.addEventListener('transitionend', function () {
      toast.remove();
    });
  }, 3000);
}
