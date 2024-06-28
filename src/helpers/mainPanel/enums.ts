export enum EMainPanelCommands {
    startMonitoring = 'startMonitoring',
    stopMonitoring = 'stopMonitoring',
    startMonitoringByConnectionString = 'startMonitoringByConnectionString',

    getEventHubs = 'getEventHubs',
    getConsumerGroups = 'getConsumerGroups',
    getIsLoggedInAzure = 'getIsLoggedInAzure',
    getConnection = 'getConnection',

    setMessages = 'setMessages',
    setEventHubs = 'setEventHubs',
    setConsumerGroups = 'setConsumerGroups',
    setIsLoggedInAzure = 'setIsLoggedInAzure',
    setConnection = 'setConnection',

    singInWithAzure = 'singInWithAzure',
    showError = 'showError',
}
