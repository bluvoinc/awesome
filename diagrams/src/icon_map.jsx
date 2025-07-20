import {
    FaUser,
    FaLock,
    FaDatabase,
    FaDesktop,
    FaKey,
    FaWallet,
    FaShieldAlt,
    FaExchangeAlt,
    FaQuestionCircle,
    FaBell,
    FaCheckCircle,
    FaTimesCircle,
    FaPuzzlePiece,
    FaServer,        // new
    FaDownload,      // new
    FaUserSecret,    // new
    FaSignature,     // new
    FaLayerGroup,    // new
} from 'react-icons/fa';

export const Icon_map = {
    // OAuth2 / CEX flow
    user:         <FaUser            size={24} />,
    oauthServer:  <FaLock            size={24} />,
    db:           <FaDatabase        size={24} />,
    clientApp:    <FaDesktop         size={24} />,
    ottService:   <FaKey             size={24} />,
    depositUI:    <FaWallet          size={24} />,
    twoFA:        <FaShieldAlt       size={24} />,
    txService:    <FaExchangeAlt     size={24} />,
    cond:         <FaQuestionCircle  size={24} />,
    notification: <FaBell            size={24} />,
    endSuccess:   <FaCheckCircle     size={24} />,
    endFailure:   <FaTimesCircle     size={24} />,

    // merged IDs
    oauth:     <FaLock            size={24} />,
    client:    <FaDesktop         size={24} />,
    tx:        <FaExchangeAlt     size={24} />,
    success:   <FaCheckCircle     size={24} />,
    failure:   <FaTimesCircle     size={24} />,

    // Bluvo flow
    widget:    <FaPuzzlePiece     size={24} />,
    ott:       <FaKey             size={24} />,
    user_b:    <FaUser            size={24} />,
    depositUI_b: <FaWallet        size={24} />,
    success_b: <FaCheckCircle     size={24} />,
    failure_b: <FaTimesCircle     size={24} />,

    // New diagram nodes
    service:   <FaServer          size={24} />,
    loader:    <FaDownload        size={24} />,
    middleman: <FaUserSecret      size={24} />,
    service_b: <FaServer          size={24} />,
    signer:    <FaSignature       size={24} />,
    mpc1:      <FaLayerGroup      size={24} />,
    mpc2:      <FaLayerGroup      size={24} />,
    mpc3:      <FaLayerGroup      size={24} />,
};

export const ICON_TITLES = {
    // OAuth2 / CEX flow
    user:         'User',
    oauthServer:  'OAuth2 Server',
    db:           'Token DB',
    clientApp:    'Client App',
    ottService:   'OTT Service',
    depositUI:    'Deposit UI',
    twoFA:        '2FA Service',
    txService:    'Transaction Service',
    cond:         'Result?',
    notification: 'Notifier',
    endSuccess:   'Success',
    endFailure:   'Failure',

    // merged IDs
    oauth:     'OAuth2 Server',
    client:    'Client App',
    tx:        'Transaction Service',
    success:   'Success',
    failure:   'Failure',

    // Bluvo flow
    widget:    'Bluvo Widget',
    ott:       'OTT Endpoint',
    user_b:    'User',
    depositUI_b: 'Deposit UI',
    success_b: 'Success',
    failure_b: 'Failure',

    // New diagram nodes
    service:   'Service',
    loader:    'Loader Function',
    middleman: 'Malicious Actor',
    service_b: 'Service',
    signer:    'Signer Node',
    mpc1:      'MPC Node A',
    mpc2:      'MPC Node B',
    mpc3:      'MPC Node C',
};
