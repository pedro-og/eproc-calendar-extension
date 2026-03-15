// eProc Calendar - Processo Detail Page Content Script
(function () {
  // Only run on process detail page (acao=processo_selecionar)
  // Must check that acao= parameter is processo_selecionar, not just that the string appears anywhere in URL
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('acao') !== CONFIG.PAGES.PROCESSO_DETALHE.URL_PATTERN) {
    return;
  }

  // Abbreviate common institution names for shorter calendar titles
  // Sort by key length descending so longer (more specific) names match first
  function abbreviatePartyName(name) {
    if (!name) return name;
    let result = name;
    const entries = Object.entries(CONFIG.PARTY_ABBREVIATIONS)
      .sort((a, b) => b[0].length - a[0].length);
    for (const [fullName, abbr] of entries) {
      if (result.toUpperCase().includes(fullName)) {
        result = result.replace(new RegExp(fullName, 'i'), abbr);
        break;
      }
    }
    return result;
  }

  // Extract party names from the Partes e Representantes table
  function extractPartyNamesFromPage() {
    const partiesTable = document.querySelector(CONFIG.PAGES.PROCESSO_DETALHE.PARTIES_TABLE_SELECTOR);
    if (!partiesTable) {
      return { firstParty: '', secondParty: '' };
    }

    let firstParty = '';
    let secondParty = '';

    const firstDataRow = partiesTable.querySelector('tr.infraTrClara');

    if (firstDataRow) {
      const cells = firstDataRow.querySelectorAll('td.autorReu');
      if (cells.length >= 1) {
        // First party from first cell
        const firstNameSpan = cells[0].querySelector('.infraNomeParte');
        if (firstNameSpan) {
          firstParty = firstNameSpan.textContent.trim();
        }
      }
      if (cells.length >= 2) {
        // Second party from second cell
        const secondNameEl = cells[1].querySelector('.infraNomeParte');
        if (secondNameEl) {
          secondParty = secondNameEl.textContent.trim();
        }
      }
    }

    // Apply abbreviations
    firstParty = abbreviatePartyName(firstParty);
    secondParty = abbreviatePartyName(secondParty);

    return { firstParty, secondParty };
  }

  // Get process number from the page
  function getProcessNumber() {
    const input = document.querySelector(CONFIG.PAGES.PROCESSO_DETALHE.PROCESS_NUMBER_SELECTOR);
    if (input) {
      return input.value.trim();
    }
    return '';
  }

  // Format process number with mask (e.g., 50016347520268240523 -> 5001634-75.2026.8.24.0523)
  function formatProcessNumber(raw) {
    if (!raw || raw.includes('-')) return raw;
    // Standard CNJ format: NNNNNNN-DD.AAAA.J.TR.OOOO
    if (raw.length === 20) {
      return `${raw.substring(0, 7)}-${raw.substring(7, 9)}.${raw.substring(9, 13)}.${raw.substring(13, 14)}.${raw.substring(14, 16)}.${raw.substring(16, 20)}`;
    }
    return raw;
  }

  // Parse Brazilian date from "Data final: DD/MM/YYYY HH:MM:SS" text
  function parseBrazilianDate(dateStr) {
    const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (!match) return null;

    const [, day, month, year, hour, minute, second] = match;
    const parsedDate = new Date(year, parseInt(month) - 1, day, hour, minute, second);

    if (isNaN(parsedDate.getTime())) return null;
    return parsedDate;
  }

  // Build event data for Google Calendar API
  function buildEventData(descriptionText, finalDate, parties, processNumber, offsetDays) {
    let title = CONFIG.LABELS.DEADLINE;
    if (parties.firstParty && parties.secondParty) {
      title = `${CONFIG.LABELS.DEADLINE} ${parties.firstParty} ${CONFIG.LABELS.X_SEPARATOR} ${parties.secondParty}`;
    } else if (parties.firstParty) {
      title = `${CONFIG.LABELS.DEADLINE} ${parties.firstParty}`;
    }

    const formattedNumber = formatProcessNumber(processNumber);
    let description = `Processo: ${formattedNumber}`;
    description += `\n${window.location.href}`;

    if (parties.firstParty || parties.secondParty) {
      const partiesDisplay = [];
      if (parties.firstParty) partiesDisplay.push(parties.firstParty);
      if (parties.secondParty) partiesDisplay.push(parties.secondParty);
      description += `\nPartes: ${partiesDisplay.join(` ${CONFIG.LABELS.VS_SEPARATOR} `)}`;
    }

    description += `\n\n${descriptionText}`;

    // Apply days offset (business days only)
    const offset = (typeof offsetDays === 'number' && offsetDays > 0) ? offsetDays : 0;
    const eventStartDate = new Date(finalDate);
    let remaining = offset;
    while (remaining > 0) {
      eventStartDate.setDate(eventStartDate.getDate() - 1);
      const dayOfWeek = eventStartDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        remaining--;
      }
    }

    if (isNaN(eventStartDate.getTime())) return null;

    // Format as YYYY-MM-DD for all-day event
    const year = eventStartDate.getFullYear();
    const month = String(eventStartDate.getMonth() + 1).padStart(2, '0');
    const day = String(eventStartDate.getDate()).padStart(2, '0');
    const startDate = `${year}-${month}-${day}`;

    // End date is the day after (Google Calendar convention for all-day events)
    const endDateAllDay = new Date(eventStartDate);
    endDateAllDay.setDate(endDateAllDay.getDate() + 1);
    const endYear = endDateAllDay.getFullYear();
    const endMonth = String(endDateAllDay.getMonth() + 1).padStart(2, '0');
    const endDay = String(endDateAllDay.getDate()).padStart(2, '0');
    const endDate = `${endYear}-${endMonth}-${endDay}`;

    return {
      summary: title,
      description: description,
      startDate: startDate,
      endDate: endDate
    };
  }

  function injectCalendarButtons() {
    const table = document.querySelector(CONFIG.PAGES.PROCESSO_DETALHE.TABLE_SELECTOR);
    if (!table) {
      return;
    }

    const parties = extractPartyNamesFromPage();
    const processNumber = getProcessNumber();
    const rows = table.querySelectorAll('tbody tr');

    let buttonCount = 0;
    const dataFinalRegex = /Data final:\s*(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})/;

    rows.forEach((row) => {
      if (row.querySelector('th')) return;
      if (row.querySelector(`.${CONFIG.UI.BUTTON_CLASS}`)) return;

      const cells = row.querySelectorAll('td');
      if (cells.length < 5) return;

      const descriptionCell = cells[CONFIG.TABLE_INDICES.PROCESSO_DETALHE.DESCRICAO];
      const cellText = descriptionCell.textContent;

      const match = cellText.match(dataFinalRegex);
      if (!match) return;

      const finalDateStr = match[1];
      const finalDate = parseBrazilianDate(finalDateStr);
      if (!finalDate) return;

      // Find the text node that contains "Data final:" and append the button after it
      const walker = document.createTreeWalker(
        descriptionCell,
        NodeFilter.SHOW_TEXT,
        null
      );

      let targetNode = null;
      while (walker.nextNode()) {
        if (walker.currentNode.textContent.includes('Data final:')) {
          targetNode = walker.currentNode;
          break;
        }
      }

      const button = document.createElement('button');
      button.className = CONFIG.UI.BUTTON_CLASS;
      button.textContent = CONFIG.UI.BUTTON_EMOJI;
      button.type = 'button';
      button.title = CONFIG.UI.BUTTON_TITLE_DEADLINE;

      button.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        chrome.storage.sync.get({ processosOffsetDays: 0, processosColorId: '', processosOpenTab: false, processosGuests: [] }, function (settings) {
          const descriptionText = descriptionCell.textContent.trim();
          const eventData = buildEventData(descriptionText, finalDate, parties, processNumber, settings.processosOffsetDays);

          if (!eventData) {
            return;
          }

          chrome.runtime.sendMessage(
            {
              type: 'CREATE_EVENT',
              eventData: eventData,
              colorId: settings.processosColorId,
              guests: settings.processosGuests
            },
            function (response) {
              if (chrome.runtime.lastError) {
                showToast('Erro ao criar evento: ' + chrome.runtime.lastError.message, 'error');
                return;
              }

              if (response.success) {
                button.textContent = '✅';
                button.classList.add('eproc-add-calendar-btn--success');
                button.disabled = true;
                button.title = 'Evento adicionado ao Calendar';
                showToast('Evento adicionado ao Google Calendar com sucesso!', 'success');

                if (settings.processosOpenTab) {
                  window.open(response.eventUrl, '_blank');
                }
              } else {
                showToast('Erro ao criar evento: ' + response.error, 'error');
              }
            }
          );
        });
      });

      // Insert button right after the "Data final: ..." text
      if (targetNode) {
        const afterTarget = targetNode.nextSibling;
        const parent = targetNode.parentNode;
        parent.insertBefore(document.createTextNode(' '), afterTarget);
        parent.insertBefore(button, afterTarget);
      } else {
        // Fallback: append to end of cell
        descriptionCell.appendChild(document.createTextNode(' '));
        descriptionCell.appendChild(button);
      }

      buttonCount++;
    });
  }

  function init() {
    const table = document.querySelector(CONFIG.PAGES.PROCESSO_DETALHE.TABLE_SELECTOR);
    if (!table) {
      return;
    }

    injectCalendarButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
