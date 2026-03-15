// Configuration file for eProc Calendar
// Centralized storage for all hardcoded strings and constants

const CONFIG = {
  // Page detection patterns
  PAGES: {
    AUDIENCIAS: {
      URL_PATTERN: 'audiencia_futura_listar',
      PAGE_TITLE: 'Audiências Futuras',
      TABLE_SELECTOR: '.infraTable'
    },
    PROCESSOS: {
      URL_PATTERN: 'citacao_intimacao_prazo_aberto_listar',
      TABLE_SELECTOR: '.infraTable[summary="Tabela de Citações e Intimações Pendentes. "]',
      TABLE_SUMMARY: 'Tabela de Citações e Intimações Pendentes. '
    },
    PROCESSO_DETALHE: {
      URL_PATTERN: 'processo_selecionar',
      TABLE_SELECTOR: '#tblEventos',
      PARTIES_TABLE_SELECTOR: '#tblPartesERepresentantes',
      PROCESS_NUMBER_SELECTOR: 'input[name="num_processo"]'
    }
  },

  // Party name abbreviations
  PARTY_ABBREVIATIONS: {
    // ===== MINISTÉRIO PÚBLICO =====
    // Federal
    'MINISTÉRIO PÚBLICO FEDERAL': 'MPF',
    'MINISTÉRIO PÚBLICO DA UNIÃO': 'MPU',
    'MINISTÉRIO PÚBLICO DO TRABALHO': 'MPT',
    'MINISTÉRIO PÚBLICO MILITAR': 'MPM',
    // Genérico
    'MINISTÉRIO PÚBLICO ESTADUAL': 'MP',
    'MINISTÉRIO PÚBLICO': 'MP',
    // Acre
    'MINISTÉRIO PÚBLICO DO ESTADO DO ACRE': 'MPAC',
    'MINISTÉRIO PÚBLICO DO ACRE': 'MPAC',
    // Alagoas
    'MINISTÉRIO PÚBLICO DO ESTADO DE ALAGOAS': 'MPAL',
    'MINISTÉRIO PÚBLICO DE ALAGOAS': 'MPAL',
    // Amapá
    'MINISTÉRIO PÚBLICO DO ESTADO DO AMAPÁ': 'MPAP',
    'MINISTÉRIO PÚBLICO DO AMAPÁ': 'MPAP',
    // Amazonas
    'MINISTÉRIO PÚBLICO DO ESTADO DO AMAZONAS': 'MPAM',
    'MINISTÉRIO PÚBLICO DO AMAZONAS': 'MPAM',
    // Bahia
    'MINISTÉRIO PÚBLICO DO ESTADO DA BAHIA': 'MPBA',
    'MINISTÉRIO PÚBLICO DA BAHIA': 'MPBA',
    // Ceará
    'MINISTÉRIO PÚBLICO DO ESTADO DO CEARÁ': 'MPCE',
    'MINISTÉRIO PÚBLICO DO CEARÁ': 'MPCE',
    // Distrito Federal
    'MINISTÉRIO PÚBLICO DO DISTRITO FEDERAL E TERRITÓRIOS': 'MPDFT',
    'MINISTÉRIO PÚBLICO DO DISTRITO FEDERAL': 'MPDFT',
    // Espírito Santo
    'MINISTÉRIO PÚBLICO DO ESTADO DO ESPÍRITO SANTO': 'MPES',
    'MINISTÉRIO PÚBLICO DO ESPÍRITO SANTO': 'MPES',
    // Goiás
    'MINISTÉRIO PÚBLICO DO ESTADO DE GOIÁS': 'MPGO',
    'MINISTÉRIO PÚBLICO DE GOIÁS': 'MPGO',
    // Maranhão
    'MINISTÉRIO PÚBLICO DO ESTADO DO MARANHÃO': 'MPMA',
    'MINISTÉRIO PÚBLICO DO MARANHÃO': 'MPMA',
    // Mato Grosso
    'MINISTÉRIO PÚBLICO DO ESTADO DE MATO GROSSO': 'MPMT',
    'MINISTÉRIO PÚBLICO DE MATO GROSSO': 'MPMT',
    // Mato Grosso do Sul
    'MINISTÉRIO PÚBLICO DO ESTADO DE MATO GROSSO DO SUL': 'MPMS',
    'MINISTÉRIO PÚBLICO DE MATO GROSSO DO SUL': 'MPMS',
    // Minas Gerais
    'MINISTÉRIO PÚBLICO DO ESTADO DE MINAS GERAIS': 'MPMG',
    'MINISTÉRIO PÚBLICO DE MINAS GERAIS': 'MPMG',
    // Pará
    'MINISTÉRIO PÚBLICO DO ESTADO DO PARÁ': 'MPPA',
    'MINISTÉRIO PÚBLICO DO PARÁ': 'MPPA',
    // Paraíba
    'MINISTÉRIO PÚBLICO DO ESTADO DA PARAÍBA': 'MPPB',
    'MINISTÉRIO PÚBLICO DA PARAÍBA': 'MPPB',
    // Paraná
    'MINISTÉRIO PÚBLICO DO ESTADO DO PARANÁ': 'MPPR',
    'MINISTÉRIO PÚBLICO DO PARANÁ': 'MPPR',
    // Pernambuco
    'MINISTÉRIO PÚBLICO DO ESTADO DE PERNAMBUCO': 'MPPE',
    'MINISTÉRIO PÚBLICO DE PERNAMBUCO': 'MPPE',
    // Piauí
    'MINISTÉRIO PÚBLICO DO ESTADO DO PIAUÍ': 'MPPI',
    'MINISTÉRIO PÚBLICO DO PIAUÍ': 'MPPI',
    // Rio de Janeiro
    'MINISTÉRIO PÚBLICO DO ESTADO DO RIO DE JANEIRO': 'MPRJ',
    'MINISTÉRIO PÚBLICO DO RIO DE JANEIRO': 'MPRJ',
    // Rio Grande do Norte
    'MINISTÉRIO PÚBLICO DO ESTADO DO RIO GRANDE DO NORTE': 'MPRN',
    'MINISTÉRIO PÚBLICO DO RIO GRANDE DO NORTE': 'MPRN',
    // Rio Grande do Sul
    'MINISTÉRIO PÚBLICO DO ESTADO DO RIO GRANDE DO SUL': 'MPRS',
    'MINISTÉRIO PÚBLICO DO RIO GRANDE DO SUL': 'MPRS',
    // Rondônia
    'MINISTÉRIO PÚBLICO DO ESTADO DE RONDÔNIA': 'MPRO',
    'MINISTÉRIO PÚBLICO DE RONDÔNIA': 'MPRO',
    // Roraima
    'MINISTÉRIO PÚBLICO DO ESTADO DE RORAIMA': 'MPRR',
    'MINISTÉRIO PÚBLICO DE RORAIMA': 'MPRR',
    // Santa Catarina
    'MINISTÉRIO PÚBLICO DO ESTADO DE SANTA CATARINA': 'MPSC',
    'MINISTÉRIO PÚBLICO DE SANTA CATARINA': 'MPSC',
    // São Paulo
    'MINISTÉRIO PÚBLICO DO ESTADO DE SÃO PAULO': 'MPSP',
    'MINISTÉRIO PÚBLICO DE SÃO PAULO': 'MPSP',
    // Sergipe
    'MINISTÉRIO PÚBLICO DO ESTADO DE SERGIPE': 'MPSE',
    'MINISTÉRIO PÚBLICO DE SERGIPE': 'MPSE',
    // Tocantins
    'MINISTÉRIO PÚBLICO DO ESTADO DO TOCANTINS': 'MPTO',
    'MINISTÉRIO PÚBLICO DO TOCANTINS': 'MPTO',

    // ===== POLÍCIA CIVIL =====
    // Genérico
    'POLÍCIA CIVIL': 'PC',
    // Acre
    'POLÍCIA CIVIL DO ESTADO DO ACRE': 'PCAC',
    'POLÍCIA CIVIL DO ACRE': 'PCAC',
    // Alagoas
    'POLÍCIA CIVIL DO ESTADO DE ALAGOAS': 'PCAL',
    'POLÍCIA CIVIL DE ALAGOAS': 'PCAL',
    // Amapá
    'POLÍCIA CIVIL DO ESTADO DO AMAPÁ': 'PCAP',
    'POLÍCIA CIVIL DO AMAPÁ': 'PCAP',
    // Amazonas
    'POLÍCIA CIVIL DO ESTADO DO AMAZONAS': 'PCAM',
    'POLÍCIA CIVIL DO AMAZONAS': 'PCAM',
    // Bahia
    'POLÍCIA CIVIL DO ESTADO DA BAHIA': 'PCBA',
    'POLÍCIA CIVIL DA BAHIA': 'PCBA',
    // Ceará
    'POLÍCIA CIVIL DO ESTADO DO CEARÁ': 'PCCE',
    'POLÍCIA CIVIL DO CEARÁ': 'PCCE',
    // Distrito Federal
    'POLÍCIA CIVIL DO DISTRITO FEDERAL': 'PCDF',
    // Espírito Santo
    'POLÍCIA CIVIL DO ESTADO DO ESPÍRITO SANTO': 'PCES',
    'POLÍCIA CIVIL DO ESPÍRITO SANTO': 'PCES',
    // Goiás
    'POLÍCIA CIVIL DO ESTADO DE GOIÁS': 'PCGO',
    'POLÍCIA CIVIL DE GOIÁS': 'PCGO',
    // Maranhão
    'POLÍCIA CIVIL DO ESTADO DO MARANHÃO': 'PCMA',
    'POLÍCIA CIVIL DO MARANHÃO': 'PCMA',
    // Mato Grosso
    'POLÍCIA CIVIL DO ESTADO DE MATO GROSSO': 'PCMT',
    'POLÍCIA CIVIL DE MATO GROSSO': 'PCMT',
    // Mato Grosso do Sul
    'POLÍCIA CIVIL DO ESTADO DE MATO GROSSO DO SUL': 'PCMS',
    'POLÍCIA CIVIL DE MATO GROSSO DO SUL': 'PCMS',
    // Minas Gerais
    'POLÍCIA CIVIL DO ESTADO DE MINAS GERAIS': 'PCMG',
    'POLÍCIA CIVIL DE MINAS GERAIS': 'PCMG',
    // Pará
    'POLÍCIA CIVIL DO ESTADO DO PARÁ': 'PCPA',
    'POLÍCIA CIVIL DO PARÁ': 'PCPA',
    // Paraíba
    'POLÍCIA CIVIL DO ESTADO DA PARAÍBA': 'PCPB',
    'POLÍCIA CIVIL DA PARAÍBA': 'PCPB',
    // Paraná
    'POLÍCIA CIVIL DO ESTADO DO PARANÁ': 'PCPR',
    'POLÍCIA CIVIL DO PARANÁ': 'PCPR',
    // Pernambuco
    'POLÍCIA CIVIL DO ESTADO DE PERNAMBUCO': 'PCPE',
    'POLÍCIA CIVIL DE PERNAMBUCO': 'PCPE',
    // Piauí
    'POLÍCIA CIVIL DO ESTADO DO PIAUÍ': 'PCPI',
    'POLÍCIA CIVIL DO PIAUÍ': 'PCPI',
    // Rio de Janeiro
    'POLÍCIA CIVIL DO ESTADO DO RIO DE JANEIRO': 'PCRJ',
    'POLÍCIA CIVIL DO RIO DE JANEIRO': 'PCRJ',
    // Rio Grande do Norte
    'POLÍCIA CIVIL DO ESTADO DO RIO GRANDE DO NORTE': 'PCRN',
    'POLÍCIA CIVIL DO RIO GRANDE DO NORTE': 'PCRN',
    // Rio Grande do Sul
    'POLÍCIA CIVIL DO ESTADO DO RIO GRANDE DO SUL': 'PCRS',
    'POLÍCIA CIVIL DO RIO GRANDE DO SUL': 'PCRS',
    // Rondônia
    'POLÍCIA CIVIL DO ESTADO DE RONDÔNIA': 'PCRO',
    'POLÍCIA CIVIL DE RONDÔNIA': 'PCRO',
    // Roraima
    'POLÍCIA CIVIL DO ESTADO DE RORAIMA': 'PCRR',
    'POLÍCIA CIVIL DE RORAIMA': 'PCRR',
    // Santa Catarina
    'POLÍCIA CIVIL DO ESTADO DE SANTA CATARINA': 'PCSC',
    'POLÍCIA CIVIL DE SANTA CATARINA': 'PCSC',
    // São Paulo
    'POLÍCIA CIVIL DO ESTADO DE SÃO PAULO': 'PCSP',
    'POLÍCIA CIVIL DE SÃO PAULO': 'PCSP',
    // Sergipe
    'POLÍCIA CIVIL DO ESTADO DE SERGIPE': 'PCSE',
    'POLÍCIA CIVIL DE SERGIPE': 'PCSE',
    // Tocantins
    'POLÍCIA CIVIL DO ESTADO DO TOCANTINS': 'PCTO',
    'POLÍCIA CIVIL DO TOCANTINS': 'PCTO',

    // ===== POLÍCIA MILITAR =====
    // Genérico
    'POLÍCIA MILITAR': 'PM',
    // Acre
    'POLÍCIA MILITAR DO ESTADO DO ACRE': 'PMAC',
    'POLÍCIA MILITAR DO ACRE': 'PMAC',
    // Alagoas
    'POLÍCIA MILITAR DO ESTADO DE ALAGOAS': 'PMAL',
    'POLÍCIA MILITAR DE ALAGOAS': 'PMAL',
    // Amapá
    'POLÍCIA MILITAR DO ESTADO DO AMAPÁ': 'PMAP',
    'POLÍCIA MILITAR DO AMAPÁ': 'PMAP',
    // Amazonas
    'POLÍCIA MILITAR DO ESTADO DO AMAZONAS': 'PMAM',
    'POLÍCIA MILITAR DO AMAZONAS': 'PMAM',
    // Bahia
    'POLÍCIA MILITAR DO ESTADO DA BAHIA': 'PMBA',
    'POLÍCIA MILITAR DA BAHIA': 'PMBA',
    // Ceará
    'POLÍCIA MILITAR DO ESTADO DO CEARÁ': 'PMCE',
    'POLÍCIA MILITAR DO CEARÁ': 'PMCE',
    // Distrito Federal
    'POLÍCIA MILITAR DO DISTRITO FEDERAL': 'PMDF',
    // Espírito Santo
    'POLÍCIA MILITAR DO ESTADO DO ESPÍRITO SANTO': 'PMES',
    'POLÍCIA MILITAR DO ESPÍRITO SANTO': 'PMES',
    // Goiás
    'POLÍCIA MILITAR DO ESTADO DE GOIÁS': 'PMGO',
    'POLÍCIA MILITAR DE GOIÁS': 'PMGO',
    // Maranhão
    'POLÍCIA MILITAR DO ESTADO DO MARANHÃO': 'PMMA',
    'POLÍCIA MILITAR DO MARANHÃO': 'PMMA',
    // Mato Grosso
    'POLÍCIA MILITAR DO ESTADO DE MATO GROSSO': 'PMMT',
    'POLÍCIA MILITAR DE MATO GROSSO': 'PMMT',
    // Mato Grosso do Sul
    'POLÍCIA MILITAR DO ESTADO DE MATO GROSSO DO SUL': 'PMMS',
    'POLÍCIA MILITAR DE MATO GROSSO DO SUL': 'PMMS',
    // Minas Gerais
    'POLÍCIA MILITAR DO ESTADO DE MINAS GERAIS': 'PMMG',
    'POLÍCIA MILITAR DE MINAS GERAIS': 'PMMG',
    // Pará
    'POLÍCIA MILITAR DO ESTADO DO PARÁ': 'PMPA',
    'POLÍCIA MILITAR DO PARÁ': 'PMPA',
    // Paraíba
    'POLÍCIA MILITAR DO ESTADO DA PARAÍBA': 'PMPB',
    'POLÍCIA MILITAR DA PARAÍBA': 'PMPB',
    // Paraná
    'POLÍCIA MILITAR DO ESTADO DO PARANÁ': 'PMPR',
    'POLÍCIA MILITAR DO PARANÁ': 'PMPR',
    // Pernambuco
    'POLÍCIA MILITAR DO ESTADO DE PERNAMBUCO': 'PMPE',
    'POLÍCIA MILITAR DE PERNAMBUCO': 'PMPE',
    // Piauí
    'POLÍCIA MILITAR DO ESTADO DO PIAUÍ': 'PMPI',
    'POLÍCIA MILITAR DO PIAUÍ': 'PMPI',
    // Rio de Janeiro
    'POLÍCIA MILITAR DO ESTADO DO RIO DE JANEIRO': 'PMRJ',
    'POLÍCIA MILITAR DO RIO DE JANEIRO': 'PMRJ',
    // Rio Grande do Norte
    'POLÍCIA MILITAR DO ESTADO DO RIO GRANDE DO NORTE': 'PMRN',
    'POLÍCIA MILITAR DO RIO GRANDE DO NORTE': 'PMRN',
    // Rio Grande do Sul
    'POLÍCIA MILITAR DO ESTADO DO RIO GRANDE DO SUL': 'PMRS',
    'POLÍCIA MILITAR DO RIO GRANDE DO SUL': 'PMRS',
    // Rondônia
    'POLÍCIA MILITAR DO ESTADO DE RONDÔNIA': 'PMRO',
    'POLÍCIA MILITAR DE RONDÔNIA': 'PMRO',
    // Roraima
    'POLÍCIA MILITAR DO ESTADO DE RORAIMA': 'PMRR',
    'POLÍCIA MILITAR DE RORAIMA': 'PMRR',
    // Santa Catarina
    'POLÍCIA MILITAR DO ESTADO DE SANTA CATARINA': 'PMSC',
    'POLÍCIA MILITAR DE SANTA CATARINA': 'PMSC',
    // São Paulo
    'POLÍCIA MILITAR DO ESTADO DE SÃO PAULO': 'PMSP',
    'POLÍCIA MILITAR DE SÃO PAULO': 'PMSP',
    // Sergipe
    'POLÍCIA MILITAR DO ESTADO DE SERGIPE': 'PMSE',
    'POLÍCIA MILITAR DE SERGIPE': 'PMSE',
    // Tocantins
    'POLÍCIA MILITAR DO ESTADO DO TOCANTINS': 'PMTO',
    'POLÍCIA MILITAR DO TOCANTINS': 'PMTO',

    // ===== POLÍCIA FEDERAL =====
    'POLÍCIA FEDERAL': 'PF',
    'POLÍCIA FEDERAL DO BRASIL': 'PF',
    'POLÍCIA RODOVIÁRIA FEDERAL': 'PRF',

    // ===== DEFENSORIA PÚBLICA =====
    'DEFENSORIA PÚBLICA DA UNIÃO': 'DPU',
    'DEFENSORIA PÚBLICA': 'DP',
    // Acre
    'DEFENSORIA PÚBLICA DO ESTADO DO ACRE': 'DPEAC',
    'DEFENSORIA PÚBLICA DO ACRE': 'DPEAC',
    // Alagoas
    'DEFENSORIA PÚBLICA DO ESTADO DE ALAGOAS': 'DPEAL',
    'DEFENSORIA PÚBLICA DE ALAGOAS': 'DPEAL',
    // Amapá
    'DEFENSORIA PÚBLICA DO ESTADO DO AMAPÁ': 'DPEAP',
    'DEFENSORIA PÚBLICA DO AMAPÁ': 'DPEAP',
    // Amazonas
    'DEFENSORIA PÚBLICA DO ESTADO DO AMAZONAS': 'DPEAM',
    'DEFENSORIA PÚBLICA DO AMAZONAS': 'DPEAM',
    // Bahia
    'DEFENSORIA PÚBLICA DO ESTADO DA BAHIA': 'DPEBA',
    'DEFENSORIA PÚBLICA DA BAHIA': 'DPEBA',
    // Ceará
    'DEFENSORIA PÚBLICA DO ESTADO DO CEARÁ': 'DPECE',
    'DEFENSORIA PÚBLICA DO CEARÁ': 'DPECE',
    // Distrito Federal
    'DEFENSORIA PÚBLICA DO DISTRITO FEDERAL': 'DPDF',
    // Espírito Santo
    'DEFENSORIA PÚBLICA DO ESTADO DO ESPÍRITO SANTO': 'DPEES',
    'DEFENSORIA PÚBLICA DO ESPÍRITO SANTO': 'DPEES',
    // Goiás
    'DEFENSORIA PÚBLICA DO ESTADO DE GOIÁS': 'DPEGO',
    'DEFENSORIA PÚBLICA DE GOIÁS': 'DPEGO',
    // Maranhão
    'DEFENSORIA PÚBLICA DO ESTADO DO MARANHÃO': 'DPEMA',
    'DEFENSORIA PÚBLICA DO MARANHÃO': 'DPEMA',
    // Mato Grosso
    'DEFENSORIA PÚBLICA DO ESTADO DE MATO GROSSO': 'DPEMT',
    'DEFENSORIA PÚBLICA DE MATO GROSSO': 'DPEMT',
    // Mato Grosso do Sul
    'DEFENSORIA PÚBLICA DO ESTADO DE MATO GROSSO DO SUL': 'DPEMS',
    'DEFENSORIA PÚBLICA DE MATO GROSSO DO SUL': 'DPEMS',
    // Minas Gerais
    'DEFENSORIA PÚBLICA DO ESTADO DE MINAS GERAIS': 'DPEMG',
    'DEFENSORIA PÚBLICA DE MINAS GERAIS': 'DPEMG',
    // Pará
    'DEFENSORIA PÚBLICA DO ESTADO DO PARÁ': 'DPEPA',
    'DEFENSORIA PÚBLICA DO PARÁ': 'DPEPA',
    // Paraíba
    'DEFENSORIA PÚBLICA DO ESTADO DA PARAÍBA': 'DPEPB',
    'DEFENSORIA PÚBLICA DA PARAÍBA': 'DPEPB',
    // Paraná
    'DEFENSORIA PÚBLICA DO ESTADO DO PARANÁ': 'DPEPR',
    'DEFENSORIA PÚBLICA DO PARANÁ': 'DPEPR',
    // Pernambuco
    'DEFENSORIA PÚBLICA DO ESTADO DE PERNAMBUCO': 'DPEPE',
    'DEFENSORIA PÚBLICA DE PERNAMBUCO': 'DPEPE',
    // Piauí
    'DEFENSORIA PÚBLICA DO ESTADO DO PIAUÍ': 'DPEPI',
    'DEFENSORIA PÚBLICA DO PIAUÍ': 'DPEPI',
    // Rio de Janeiro
    'DEFENSORIA PÚBLICA DO ESTADO DO RIO DE JANEIRO': 'DPERJ',
    'DEFENSORIA PÚBLICA DO RIO DE JANEIRO': 'DPERJ',
    // Rio Grande do Norte
    'DEFENSORIA PÚBLICA DO ESTADO DO RIO GRANDE DO NORTE': 'DPERN',
    'DEFENSORIA PÚBLICA DO RIO GRANDE DO NORTE': 'DPERN',
    // Rio Grande do Sul
    'DEFENSORIA PÚBLICA DO ESTADO DO RIO GRANDE DO SUL': 'DPERS',
    'DEFENSORIA PÚBLICA DO RIO GRANDE DO SUL': 'DPERS',
    // Rondônia
    'DEFENSORIA PÚBLICA DO ESTADO DE RONDÔNIA': 'DPERO',
    'DEFENSORIA PÚBLICA DE RONDÔNIA': 'DPERO',
    // Roraima
    'DEFENSORIA PÚBLICA DO ESTADO DE RORAIMA': 'DPERR',
    'DEFENSORIA PÚBLICA DE RORAIMA': 'DPERR',
    // Santa Catarina
    'DEFENSORIA PÚBLICA DO ESTADO DE SANTA CATARINA': 'DPESC',
    'DEFENSORIA PÚBLICA DE SANTA CATARINA': 'DPESC',
    // São Paulo
    'DEFENSORIA PÚBLICA DO ESTADO DE SÃO PAULO': 'DPESP',
    'DEFENSORIA PÚBLICA DE SÃO PAULO': 'DPESP',
    // Sergipe
    'DEFENSORIA PÚBLICA DO ESTADO DE SERGIPE': 'DPESE',
    'DEFENSORIA PÚBLICA DE SERGIPE': 'DPESE',
    // Tocantins
    'DEFENSORIA PÚBLICA DO ESTADO DO TOCANTINS': 'DPETO',
    'DEFENSORIA PÚBLICA DO TOCANTINS': 'DPETO',

    // ===== AUTORIDADES =====
    'AUTORIDADE POLICIAL': 'AP',
    'DELEGADO DE POLÍCIA': 'DEL',

    // ===== OUTROS ÓRGÃOS =====
    'INSTITUTO NACIONAL DO SEGURO SOCIAL': 'INSS',
    'UNIÃO FEDERAL': 'UNIÃO',
    'UNIÃO': 'UNIÃO',
    'CAIXA ECONÔMICA FEDERAL': 'CEF',
    'BANCO DO BRASIL S.A.': 'BB',
    'BANCO DO BRASIL': 'BB',
    'ORDEM DOS ADVOGADOS DO BRASIL': 'OAB',
  },

  // Regex patterns for parsing
  PATTERNS: {
    BRAZILIAN_DATE: /(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2}):(\d{2})/,
    PLAINTIFF: /Autor([^-]*?)(?:\s*-\s*AUTORX)?Réu/i,
    DEFENDANT: /Réu([^-]*?)(?:\s*-\s*ACUSADO)?$/i,
    START_DATETIME: /Início(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})/,
    END_DATETIME: /Previsão\s*Término(\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}:\d{2})/,
    ROOM: /Sala[:\s]+([^I]*?)(?:Início|$)/,
    TEAMS_URL: /teams.microsoft/,
    PARTY_SEPARATOR: /X(?=\s*(Réu|Executado|Indiciado|Requerido|Autor\s*Fato|Exequente))/i,
    PARTY_ROLES: /(Autor|Exequente|Requerente|Autoridade\s*Pol\.|Autoridade\s*Pol|Autor\s*Fato)/i,
    DEFENDANT_ROLES: /(Réu|Executado|Indiciado|Requerido|Autor\s*Fato)/i,
    DURATION_SUFFIX: /\s*\d+\s*dias?$/i,
  },

  // UI Elements
  UI: {
    BUTTON_CLASS: 'eproc-add-calendar-btn',
    BUTTON_EMOJI: '📅',
    BUTTON_TITLE_HEARING: 'Add to Google Calendar',
    BUTTON_TITLE_DEADLINE: 'Add deadline to Google Calendar',
  },

  // Google Calendar configuration
  GOOGLE_CALENDAR: {
    EVENTS_API_URL: 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    TEAMS_LABEL: 'Teams',
    COLOR_OPTIONS: [
      { value: '', label: 'Padrão (calendário)', hex: null },
      { value: '1', label: 'Lavanda', hex: '#7986CB' },
      { value: '2', label: 'Sálvia', hex: '#33B679' },
      { value: '3', label: 'Uva', hex: '#8E24AA' },
      { value: '4', label: 'Flamingo', hex: '#E67C73' },
      { value: '5', label: 'Banana', hex: '#F6BF26' },
      { value: '6', label: 'Tangerina', hex: '#F4511E' },
      { value: '7', label: 'Pavão', hex: '#039BE5' },
      { value: '8', label: 'Grafite', hex: '#616161' },
      { value: '9', label: 'Mirtilo', hex: '#3F51B5' },
      { value: '10', label: 'Manjericão', hex: '#0B8043' },
      { value: '11', label: 'Tomate', hex: '#D50000' }
    ]
  },

  // Default text labels
  LABELS: {
    HEARING: '[AUDIÊNCIA]',
    PROCESS: 'Processo',
    DEADLINE: '[PRAZO]',
    LOCATION_PREFIX: 'Webconference',
    VS_SEPARATOR: '-',
    X_SEPARATOR: 'x',
  },

  // Table cell indices
  TABLE_INDICES: {
    AUDIENCIAS: {
      PROCESS: 0,
      EVENT_TYPE: 1,
      DATE_TIME: 2,
      NOTES: 3,
    },
    PROCESSOS: {
      PROCESS: 1,
      PROCESS_CLASS: 2,
      SUBJECT: 3,
      EVENT: 4,
      REQUEST_DATE: 5,
      START_DATE: 6,
      FINAL_DATE: 7,
    },
    PROCESSO_DETALHE: {
      EVENTO: 0,
      DATA_HORA: 1,
      DESCRICAO: 2,
      USUARIO: 3,
      DOCUMENTOS: 4,
    }
  }
};
