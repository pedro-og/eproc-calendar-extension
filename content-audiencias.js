// eProc Calendar - Audiências Page Content Script
(function () {
  // Only run on hearing page
  if (!window.location.href.includes(CONFIG.PAGES.AUDIENCIAS.URL_PATTERN)) {
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

  function formatISODateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  function extractPartyNames(cellText) {
    let firstParty = '';
    let secondParty = '';

    const normalized = cellText.replace(/\s+/g, ' ').trim();

    const parts = normalized.split(CONFIG.PATTERNS.PARTY_SEPARATOR);

    if (parts.length >= 2) {
      const firstPart = parts[0];
      // Se tem 3 partes (split gerou: antes X, "Réu", depois X), usa a terceira
      // Se tem 2 partes (split gerou: antes X, depois X), usa a segunda
      const secondPart = parts.length >= 3 ? parts[2] : parts[1];

      // Padrão para audiências: "AutorNOME - AUTOR" (com sufixo - AUTOR)
      // Padrão para processos: "AutorNOME(CPF)" (com parênteses)

      // Tenta extrair primeira parte - com parênteses (processos)
      let firstMatch = firstPart.match(/(Autor|Exequente|Requerente|Autorid\.\s*Pol\.|Autoridade\s*Pol\.?|Autor\s*Fato)\s*([A-Z][A-Za-záàâãéèêíïóôõöúçñ\s]+)\s*\(/i);

      if (firstMatch) {
        firstParty = firstMatch[2].trim();
      } else {
        // Fallback para audiências: "AutorNOME - AUTOR"
        firstMatch = firstPart.match(/(Autor|Exequente|Requerente|Autorid\.\s*Pol\.|Autoridade\s*Pol\.?|Autor\s*Fato)\s*([A-Z][A-Za-záàâãéèêíïóôõöúçñ\s]+)(?:\s*-\s*(?:AUTOR|EXEQUENTE|REQUERENTE))?$/i);
        if (firstMatch) {
          let candidateName = firstMatch[2].trim();
          candidateName = candidateName.replace(/^\d+\s*/, '').trim();
          candidateName = candidateName.replace(/\s*-\s*(?:AUTOR|EXEQUENTE|REQUERENTE)?$/i, '').trim();
          if (candidateName && candidateName.length > 2) {
            firstParty = candidateName;
          }
        }
      }

      // Tenta extrair segunda parte - com parênteses (processos)
      let secondMatch = secondPart.match(/(Réu|Executado|Indiciado|Requerido|Autor\s*Fato)\s*([A-Z][A-Za-záàâãéèêíïóôõöúçñ\s]+)\s*\(/i);

      if (secondMatch) {
        secondParty = secondMatch[2].trim();
      } else {
        // Fallback para audiências: pode ter múltiplas partes, pega a primeira
        // Importante: \s* depois do rótulo permite zero espaços (RéuFLAVIO ou Réu FLAVIO)
        secondMatch = secondPart.match(/(Réu|Executado|Indiciado|Requerido|Autor\s*Fato)\s*([A-Z][A-Za-záàâãéèêíïóôõöúçñ\s]+)(?:\s*-\s*(?:RÉU|EXECUTADO|INDICIADO|REQUERIDO|ACUSADO))?/i);
        if (secondMatch) {
          let candidateName = secondMatch[2].trim();
          candidateName = candidateName.replace(/^\d+\s*/, '').trim();
          candidateName = candidateName.replace(/\s*-\s*(?:RÉU|EXECUTADO|INDICIADO|REQUERIDO|ACUSADO)?$/i, '').trim();
          // Remove tudo após múltiplas partes (audências têm vários réus)
          candidateName = candidateName.split(/\s+(?:POST|COM|E\s+)/i)[0].trim();
          if (candidateName && candidateName.length > 2) {
            secondParty = candidateName;
          }
        }
      }
    }

    return { firstParty, secondParty };
  }

  // Parse a single hearing row from the table
  function parseHearingRow(row) {
    const cells = row.querySelectorAll('td');
    if (cells.length < 4) {
      return null;
    }

    const processCell = cells[0];
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

    let partyInfo = '';
    if (firstParty && secondParty) {
      partyInfo = `${firstParty} ${CONFIG.LABELS.X_SEPARATOR} ${secondParty}`;
    } else if (firstParty) {
      partyInfo = firstParty;
    }

    const eventType = cells[1].textContent.trim();

    const dateTimeCell = cells[2];
    const dateTimeText = dateTimeCell.textContent;

    const startMatch = dateTimeText.match(CONFIG.PATTERNS.START_DATETIME);
    const endMatch = dateTimeText.match(CONFIG.PATTERNS.END_DATETIME);
    const roomMatch = dateTimeText.match(CONFIG.PATTERNS.ROOM);

    if (!startMatch || !endMatch) {
      return null;
    }

    const startDateTime = parseBrazilianDate(startMatch[1]);
    const endDateTime = parseBrazilianDate(endMatch[1]);

    if (!startDateTime || !endDateTime) {
      return null;
    }

    const linkElement = dateTimeCell.querySelector(`a[href*="${CONFIG.PATTERNS.TEAMS_URL.source}"]`);
    const webconferenceUrl = linkElement ? linkElement.href : null;

    let notes = '';
    const notesCell = cells[3];
    if (notesCell) {
      const textNodes = Array.from(notesCell.childNodes).filter(node => node.nodeType === 3);
      notes = textNodes.map(node => node.textContent.trim()).join(' ').trim();
    }

    let location = '';
    if (roomMatch) {
      location = roomMatch[1].trim();
    }
    if (webconferenceUrl) {
      location = location ? `${location} (${CONFIG.GOOGLE_CALENDAR.TEAMS_LABEL})` : `${CONFIG.LABELS.LOCATION_PREFIX} (${CONFIG.GOOGLE_CALENDAR.TEAMS_LABEL})`;
    }

    return {
      processNumber,
      processUrl,
      partyInfo,
      firstParty,
      secondParty,
      eventType,
      startDateTime,
      endDateTime,
      location,
      notes,
      webconferenceUrl
    };
  }

  // Extract all hearings from the page
  function extractHearings() {
    const hearings = [];
    const table = document.querySelector(CONFIG.PAGES.AUDIENCIAS.TABLE_SELECTOR);

    if (!table) {
      return hearings;
    }

    const rows = table.querySelectorAll('tbody tr');

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];

      // Skip header rows
      if (row.querySelector('th')) continue;

      const hearing = parseHearingRow(row);
      if (hearing) {
        hearings.push(hearing);
      }
    }

    return hearings;
  }

  // Build event data for Google Calendar API
  function buildHearingEventData(hearing, offsetDays) {
    // Use party info if available, otherwise use process number as fallback
    let title = CONFIG.LABELS.HEARING;
    if (hearing.partyInfo) {
      title = `${CONFIG.LABELS.HEARING} ${hearing.partyInfo}`;
    } else {
      title = `${CONFIG.LABELS.HEARING} ${CONFIG.LABELS.PROCESS} ${hearing.processNumber}`;
    }

    // Build description with process link
    let description = `${CONFIG.LABELS.PROCESS}: ${hearing.processNumber}`;
    if (hearing.processUrl) {
      description += `\n${hearing.processUrl}`;
    }

    if (hearing.firstParty || hearing.secondParty) {
      const partiesDisplay = [];
      if (hearing.firstParty) partiesDisplay.push(hearing.firstParty);
      if (hearing.secondParty) partiesDisplay.push(hearing.secondParty);
      description += `\nPartes: ${partiesDisplay.join(` ${CONFIG.LABELS.VS_SEPARATOR} `)}`;
    }

    description += `\nEvento: ${hearing.eventType}`;
    description += `\nLocalização: ${hearing.location || '[não informada]'}`;
    if (hearing.notes) {
      description += `\nNotas: ${hearing.notes}`;
    }

    // Apply days offset to both start and end dates (business days only - skips weekends)
    const offset = (typeof offsetDays === 'number' && offsetDays > 0) ? offsetDays : 0;
    const eventStartDate = new Date(hearing.startDateTime);
    const eventEndDate = new Date(hearing.endDateTime);
    let remaining = offset;
    while (remaining > 0) {
      eventStartDate.setDate(eventStartDate.getDate() - 1);
      eventEndDate.setDate(eventEndDate.getDate() - 1);
      const dayOfWeek = eventStartDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        remaining--;
      }
    }

    if (isNaN(eventStartDate.getTime()) || isNaN(eventEndDate.getTime())) {
      return null;
    }

    const startDateTime = formatISODateTime(eventStartDate);
    const endDateTime = formatISODateTime(eventEndDate);

    return {
      summary: title,
      description: description,
      location: hearing.location || '',
      startDateTime: startDateTime,
      endDateTime: endDateTime
    };
  }

  // Create calendar icon button for each hearing row (notes column only)
  function injectIndividualButtons() {
    const table = document.querySelector(CONFIG.PAGES.AUDIENCIAS.TABLE_SELECTOR);
    if (!table) {
      return;
    }

    const rows = table.querySelectorAll('tbody tr');

    let buttonCount = 0;
    rows.forEach((row, index) => {
      // Skip header rows (rows with th elements)
      if (row.querySelector('th')) {
        return;
      }

      // Check if button already exists
      if (row.querySelector(`.${CONFIG.UI.BUTTON_CLASS}`)) {
        return;
      }

      const cells = row.querySelectorAll('td');

      // Notes column is the 4th column (index 3)
      if (cells.length >= 4) {
        const notesCell = cells[CONFIG.TABLE_INDICES.AUDIENCIAS.NOTES];

        const button = document.createElement('button');
        button.className = CONFIG.UI.BUTTON_CLASS;
        button.textContent = CONFIG.UI.BUTTON_EMOJI;
        button.type = 'button';
        button.title = CONFIG.UI.BUTTON_TITLE_HEARING;

        button.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();

          chrome.storage.sync.get({ audienciasOffsetDays: 0, audienciasColorId: '', audienciasOpenTab: false, audienciasGuests: [] }, function (settings) {
            const hearing = parseHearingRow(row);
            if (hearing) {
              const eventData = buildHearingEventData(hearing, settings.audienciasOffsetDays);
              if (!eventData) {
                return;
              }

              // Send message to background script to create event via API
              chrome.runtime.sendMessage(
                {
                  type: 'CREATE_EVENT',
                  eventData: eventData,
                  colorId: settings.audienciasColorId,
                  guests: settings.audienciasGuests
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

                    if (settings.audienciasOpenTab) {
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

        notesCell.appendChild(button);
        buttonCount++;
      }
    });
  }

  // Initialize extension
  function init() {
    const table = document.querySelector(CONFIG.PAGES.AUDIENCIAS.TABLE_SELECTOR);
    if (!table) {
      return;
    }

    injectIndividualButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
