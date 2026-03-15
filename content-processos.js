// eProc Calendar - Processos Page Content Script
(function () {
  // Only run on process deadline page
  if (!window.location.href.includes(CONFIG.PAGES.PROCESSOS.URL_PATTERN)) {
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

  // Parsing utilities for Brazilian date format
  function parseBrazilianDate(dateStr) {
    const match = dateStr.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/);
    if (!match) {
      return null;
    }

    const [, day, month, year, hour, minute, second] = match;
    const parsedDate = new Date(year, parseInt(month) - 1, day, hour, minute, second);

    if (isNaN(parsedDate.getTime())) {
      return null;
    }

    return parsedDate;
  }


  function extractPartyNames(cellText) {
    let firstParty = '';
    let secondParty = '';

    const normalized = cellText.replace(/\s+/g, ' ').trim();

    const parts = normalized.split(CONFIG.PATTERNS.PARTY_SEPARATOR);

    if (parts.length >= 2) {
      // Extrair primeira parte com regex melhorado
      // Usa a primeira parte (antes do primeiro X)
      const firstPart = parts[0];

      // Usa a ÚLTIMA parte (depois do último X) para segunda parte
      const secondPart = parts[parts.length - 1];

      // Tenta extrair com parênteses primeiro (mais preciso)
      let firstMatch = firstPart.match(/(Autor|Exequente|Requerente|Autorid\.\s*Pol\.|Autoridade\s*Pol\.?|Autor\s*Fato)\s*([A-Z][A-Za-záàâãéèêíïóôõöúçñ\s]+?)\s*\(/i);

      if (firstMatch) {
        firstParty = firstMatch[2].trim();
      } else {
        // Fallback: extrai nome após rótulo, para na primeira vez que vir parêntesis ou número
        firstMatch = firstPart.match(/(Autor|Exequente|Requerente|Autorid\.\s*Pol\.|Autoridade\s*Pol\.?|Autor\s*Fato)\s*([A-Z][A-Za-záàâãéèêíïóôõöúçñ\s]+?)(?:\s*\(|\s+\d+|$)/i);
        if (firstMatch) {
          let candidateName = firstMatch[2].trim();
          candidateName = candidateName.replace(/^\d+\s*/, '').trim();
          if (candidateName && candidateName.length > 2) {
            firstParty = candidateName;
          }
        }
      }

      // Extrair segunda parte com regex melhorado (já definida acima)

      // Tenta extrair com parênteses primeiro
      let secondMatch = secondPart.match(/(Réu|Executado|Indiciado|Requerido|Autor\s*Fato)\s*([A-Z][A-Za-záàâãéèêíïóôõöúçñ\s]+?)\s*\(/i);

      if (secondMatch) {
        secondParty = secondMatch[2].trim();
      } else {
        // Fallback: extrai nome após rótulo, para na primeira vez que vir parêntesis ou número
        secondMatch = secondPart.match(/(Réu|Executado|Indiciado|Requerido|Autor\s*Fato)\s*([A-Z][A-Za-záàâãéèêíïóôõöúçñ\s]+?)(?:\s*\(|\s+\d+|$)/i);
        if (secondMatch) {
          let candidateName = secondMatch[2].trim();
          // Remove números de CPF/CNPJ se estiverem no início
          candidateName = candidateName.replace(/^\d+\s*/, '').trim();
          // Limpa caracteres especiais nas extremidades
          candidateName = candidateName.replace(/[\s\-]+$/, '').trim();
          if (candidateName && candidateName.length > 2) {
            secondParty = candidateName;
          }
        }
      }
    }

    return { firstParty, secondParty };
  }

  function parseProcessRow(row) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 8) {
      return null;
    }

    const processCell = cells[1];
    const processLink = processCell.querySelector('a');
    const processNumber = processLink ? processLink.textContent.trim() : '';
    const processUrl = processLink ? processLink.href : '';

    if (!processNumber) {
      return null;
    }

    const cellText = processCell.textContent;
    let { firstParty, secondParty } = extractPartyNames(cellText);

    // Apply abbreviations to party names
    firstParty = abbreviatePartyName(firstParty);
    secondParty = abbreviatePartyName(secondParty);

    const processClass = cells[2].textContent.trim();
    const subject = cells[3].textContent.trim();

    let event = cells[4].textContent.trim();
    event = event.replace(/\s*\d+\s*dias?$/i, '').trim();

    const requestDate = cells[5].textContent.trim();
    const startDate = cells[6].textContent.trim();
    const finalDate = cells[7].textContent.trim();

    if (!finalDate) {
      return null;
    }

    const finalDateTime = parseBrazilianDate(finalDate);
    if (!finalDateTime) {
      return null;
    }

    let title = CONFIG.LABELS.DEADLINE;
    if (firstParty && secondParty) {
      title = `${CONFIG.LABELS.DEADLINE} ${firstParty} ${CONFIG.LABELS.X_SEPARATOR} ${secondParty}`;
    } else if (firstParty) {
      title = `${CONFIG.LABELS.DEADLINE} ${firstParty}`;
    }

    return {
      processNumber,
      processUrl,
      firstParty,
      secondParty,
      processClass: processClass,
      subject: subject,
      event: event,
      finalDate: finalDateTime,
      startDate: parseBrazilianDate(startDate),
      requestDate: parseBrazilianDate(requestDate),
      title
    };
  }

  // Build event data for Google Calendar API
  function buildProcessEventData(process, offsetDays) {
    if (!process.finalDate) {
      return null;
    }

    let title = process.title;

    let description = `Processo: ${process.processNumber}`;

    if (process.processUrl) {
      description += `\n${process.processUrl}`;
    }

    if (process.firstParty || process.secondParty) {
      const partiesDisplay = [];
      if (process.firstParty) partiesDisplay.push(process.firstParty);
      if (process.secondParty) partiesDisplay.push(process.secondParty);
      description += `\nPartes: ${partiesDisplay.join(` ${CONFIG.LABELS.VS_SEPARATOR} `)}`;
    } else {
      description += `\nPartes: [NÃO EXTRAÍDAS - Verifique a página]`;
    }

    description += `\nClasse: ${process.processClass || '[não informada]'}`;
    if (process.subject) {
      description += `\nAssunto: ${process.subject}`;
    }

    const eventDisplay = process.event && process.event.trim().length > 0
      ? process.event
      : '[Evento não informado - Verifique a página]';
    description += `\nEvento: ${eventDisplay}`;

    // Add final deadline to description
    const fd = process.finalDate;
    const finalDateFormatted = `${String(fd.getDate()).padStart(2, '0')}/${String(fd.getMonth() + 1).padStart(2, '0')}/${fd.getFullYear()} ${String(fd.getHours()).padStart(2, '0')}:${String(fd.getMinutes()).padStart(2, '0')}:${String(fd.getSeconds()).padStart(2, '0')}`;
    description += `\nPrazo final: ${finalDateFormatted}`;

    // Apply days offset to event start date (business days only - skips weekends)
    const offset = (typeof offsetDays === 'number' && offsetDays > 0) ? offsetDays : 0;
    const eventStartDate = new Date(process.finalDate);
    let remaining = offset;
    while (remaining > 0) {
      eventStartDate.setDate(eventStartDate.getDate() - 1);
      const dayOfWeek = eventStartDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        remaining--;
      }
    }

    if (isNaN(eventStartDate.getTime())) {
      return null;
    }

    // Format dates as YYYY-MM-DD for all-day event
    const year = eventStartDate.getFullYear();
    const month = String(eventStartDate.getMonth() + 1).padStart(2, '0');
    const day = String(eventStartDate.getDate()).padStart(2, '0');
    const startDate = `${year}-${month}-${day}`;

    // End date is the day after for all-day events (Google Calendar convention)
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
    const table = document.querySelector(CONFIG.PAGES.PROCESSOS.TABLE_SELECTOR);
    if (!table) {
      return;
    }

    const rows = table.querySelectorAll('tbody tr');

    let buttonCount = 0;
    rows.forEach((row, index) => {
      if (row.querySelector('th')) {
        return;
      }

      if (row.querySelector(`.${CONFIG.UI.BUTTON_CLASS}`)) {
        return;
      }

      const cells = row.querySelectorAll('td');

      if (cells.length >= 8) {
        const deadlineCell = cells[CONFIG.TABLE_INDICES.PROCESSOS.FINAL_DATE];

        const button = document.createElement('button');
        button.className = CONFIG.UI.BUTTON_CLASS;
        button.textContent = CONFIG.UI.BUTTON_EMOJI;
        button.type = 'button';
        button.title = CONFIG.UI.BUTTON_TITLE_DEADLINE;

        button.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();

          chrome.storage.sync.get({ processosOffsetDays: 0, processosColorId: '', processosOpenTab: false, processosGuests: [] }, function (settings) {
            const process = parseProcessRow(row);
            if (process) {
              const eventData = buildProcessEventData(process, settings.processosOffsetDays);
              if (!eventData) {
                return;
              }

              // Send message to background script to create event via API
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
            }
          });
        });

        deadlineCell.appendChild(document.createTextNode(' '));
        deadlineCell.appendChild(button);
        buttonCount++;
      }
    });
  }

  // Initialize extension
  function init() {
    const table = document.querySelector(CONFIG.PAGES.PROCESSOS.TABLE_SELECTOR);
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
