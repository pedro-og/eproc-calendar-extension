// eProc Calendar - Popup Settings Script

const DEFAULT_SETTINGS = {
  processosOffsetDays: 0,
  audienciasOffsetDays: 0,
  processosColorId: '',
  audienciasColorId: '',
  audienciasOpenTab: false,
  processosOpenTab: false,
  audienciasGuests: [],
  processosGuests: []
};

// Build a custom color picker dropdown
function buildColorPicker(container) {
  let currentValue = '';

  const selected = document.createElement('div');
  selected.className = 'color-picker-selected';
  container.appendChild(selected);

  const dropdown = document.createElement('div');
  dropdown.className = 'color-picker-dropdown';
  container.appendChild(dropdown);

  function renderSelected(option) {
    selected.innerHTML = '';
    if (option.hex) {
      const dot = document.createElement('span');
      dot.className = 'color-dot';
      dot.style.backgroundColor = option.hex;
      selected.appendChild(dot);
    }
    const text = document.createTextNode(option.label);
    selected.appendChild(text);
  }

  CONFIG.GOOGLE_CALENDAR.COLOR_OPTIONS.forEach(option => {
    const item = document.createElement('div');
    item.className = 'color-picker-option';
    item.dataset.value = option.value;

    if (option.hex) {
      const dot = document.createElement('span');
      dot.className = 'color-dot';
      dot.style.backgroundColor = option.hex;
      item.appendChild(dot);
    }

    const text = document.createTextNode(option.label);
    item.appendChild(text);

    item.addEventListener('click', () => {
      currentValue = option.value;
      renderSelected(option);
      dropdown.querySelectorAll('.color-picker-option').forEach(el => el.classList.remove('selected'));
      item.classList.add('selected');
      container.classList.remove('open');
    });

    dropdown.appendChild(item);
  });

  // Default render
  renderSelected(CONFIG.GOOGLE_CALENDAR.COLOR_OPTIONS[0]);

  selected.addEventListener('click', () => {
    // Close all other pickers
    document.querySelectorAll('.color-picker.open').forEach(el => {
      if (el !== container) el.classList.remove('open');
    });
    container.classList.toggle('open');
  });

  return {
    get value() { return currentValue; },
    set value(val) {
      currentValue = val;
      const opt = CONFIG.GOOGLE_CALENDAR.COLOR_OPTIONS.find(o => o.value === val) || CONFIG.GOOGLE_CALENDAR.COLOR_OPTIONS[0];
      renderSelected(opt);
      dropdown.querySelectorAll('.color-picker-option').forEach(el => {
        el.classList.toggle('selected', el.dataset.value === val);
      });
    }
  };
}

// Build a tag-style email input
function buildTagInput(container, inputElement) {
  const emails = [];

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function addTag(email) {
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !isValidEmail(trimmed) || emails.includes(trimmed)) return;

    emails.push(trimmed);

    const tag = document.createElement('span');
    tag.className = 'email-tag';
    tag.textContent = trimmed;

    const removeBtn = document.createElement('span');
    removeBtn.className = 'tag-remove';
    removeBtn.textContent = '\u00d7';
    removeBtn.addEventListener('click', () => {
      const idx = emails.indexOf(trimmed);
      if (idx > -1) emails.splice(idx, 1);
      tag.remove();
    });

    tag.appendChild(removeBtn);
    container.insertBefore(tag, inputElement);
  }

  function handleInput(e) {
    if (e.key === 'Enter' || e.key === ',' || e.key === ' ' || e.key === 'Tab') {
      e.preventDefault();
      const val = inputElement.value.replace(/,/g, '').trim();
      if (val) addTag(val);
      inputElement.value = '';
    }
    if (e.key === 'Backspace' && inputElement.value === '' && emails.length > 0) {
      const lastTag = container.querySelector('.email-tag:last-of-type');
      if (lastTag) {
        emails.pop();
        lastTag.remove();
      }
    }
  }

  // Also add on blur (when user clicks away)
  function handleBlur() {
    const val = inputElement.value.replace(/,/g, '').trim();
    if (val) addTag(val);
    inputElement.value = '';
  }

  // Focus input when clicking the container
  container.addEventListener('click', () => inputElement.focus());
  inputElement.addEventListener('keydown', handleInput);
  inputElement.addEventListener('blur', handleBlur);

  return {
    get value() { return [...emails]; },
    set value(arr) {
      // Clear existing tags
      container.querySelectorAll('.email-tag').forEach(el => el.remove());
      emails.length = 0;
      if (Array.isArray(arr)) {
        arr.forEach(email => addTag(email));
      }
    }
  };
}

// Initialize all elements after DOM is ready
function init() {
  const processosInput = document.getElementById('processosOffset');
  const audienciasInput = document.getElementById('audienciasOffset');
  const saveButton = document.getElementById('save');
  const statusDiv = document.getElementById('status');

  const audienciasColorPicker = buildColorPicker(document.getElementById('audienciasColor'));
  const processosColorPicker = buildColorPicker(document.getElementById('processosColor'));
  const audienciasOpenTabCheckbox = document.getElementById('audienciasOpenTab');
  const processosOpenTabCheckbox = document.getElementById('processosOpenTab');

  const audienciasGuestsTagInput = buildTagInput(
    document.getElementById('audienciasGuestsContainer'),
    document.getElementById('audienciasGuestsInput')
  );
  const processosGuestsTagInput = buildTagInput(
    document.getElementById('processosGuestsContainer'),
    document.getElementById('processosGuestsInput')
  );

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.color-picker')) {
      document.querySelectorAll('.color-picker.open').forEach(el => el.classList.remove('open'));
    }
  });

  // Load current settings when popup opens
  chrome.storage.sync.get(DEFAULT_SETTINGS, function (settings) {
    processosInput.value = settings.processosOffsetDays;
    audienciasInput.value = settings.audienciasOffsetDays;
    processosColorPicker.value = settings.processosColorId;
    audienciasColorPicker.value = settings.audienciasColorId;
    audienciasOpenTabCheckbox.checked = settings.audienciasOpenTab;
    processosOpenTabCheckbox.checked = settings.processosOpenTab;
    audienciasGuestsTagInput.value = settings.audienciasGuests;
    processosGuestsTagInput.value = settings.processosGuests;
  });

  // Save settings on button click
  saveButton.addEventListener('click', function () {
    const processosVal = parseInt(processosInput.value, 10);
    const audienciasVal = parseInt(audienciasInput.value, 10);
    const processosColorVal = processosColorPicker.value;
    const audienciasColorVal = audienciasColorPicker.value;

    // Validate range
    if (isNaN(processosVal) || processosVal < 0 || processosVal > 30) {
      statusDiv.textContent = 'Valor inválido para Prazos (0-30).';
      statusDiv.style.color = '#c62828';
      return;
    }

    if (isNaN(audienciasVal) || audienciasVal < 0 || audienciasVal > 30) {
      statusDiv.textContent = 'Valor inválido para Audiências (0-30).';
      statusDiv.style.color = '#c62828';
      return;
    }

    chrome.storage.sync.set({
      processosOffsetDays: processosVal,
      audienciasOffsetDays: audienciasVal,
      processosColorId: processosColorVal,
      audienciasColorId: audienciasColorVal,
      audienciasOpenTab: audienciasOpenTabCheckbox.checked,
      processosOpenTab: processosOpenTabCheckbox.checked,
      audienciasGuests: audienciasGuestsTagInput.value,
      processosGuests: processosGuestsTagInput.value
    }, function () {
      statusDiv.textContent = 'Configurações salvas!';
      statusDiv.style.color = '#2e7d32';

      // Clear status after 2 seconds
      setTimeout(function () {
        statusDiv.textContent = '';
      }, 2000);
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
