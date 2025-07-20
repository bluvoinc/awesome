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
    FaServer,
    FaDownload,
    FaUserSecret,
    FaSignature,
    FaLayerGroup,
} from 'react-icons/fa';

export const Icon_map = {
    // OAuth2 / CEX flow
    'user':         <FaUser            size={24} />,
    'oauthServer':  <FaLock            size={24} />,
    'db':           <FaDatabase        size={24} />,
    'clientApp':    <FaDesktop         size={24} />,
    'ottService':   <FaKey             size={24} />,
    'depositUI':    <FaWallet          size={24} />,
    'twoFA':        <FaShieldAlt       size={24} />,
    'txService':    <FaExchangeAlt     size={24} />,
    'cond':         <FaQuestionCircle  size={24} />,
    'notification': <FaBell            size={24} />,
    'endSuccess':   <FaCheckCircle     size={24} />,
    'endFailure':   <FaTimesCircle     size={24} />,

    // merged IDs
    'oauth':     <FaLock            size={24} />,
    'client':    <FaDesktop         size={24} />,
    'tx':        <FaExchangeAlt     size={24} />,
    'success':   <FaCheckCircle     size={24} />,
    'failure':   <FaTimesCircle     size={24} />,

    // Bluvo flow
    'widget':    <FaPuzzlePiece     size={24} />,
    'ott':       <FaKey             size={24} />,
    'user_b':    <FaUser            size={24} />,
    'depositUI_b': <FaWallet        size={24} />,
    'success_b': <FaCheckCircle     size={24} />,
    'failure_b': <FaTimesCircle     size={24} />,

    // Previous diagram nodes
    'service':   <FaServer          size={24} />,
    'loader':    <FaDownload        size={24} />,
    'middleman': <FaUserSecret      size={24} />,
    'service_b': <FaServer          size={24} />,
    'signer':    <FaSignature       size={24} />,
    'mpc1':      <FaLayerGroup      size={24} />,
    'mpc2':      <FaLayerGroup      size={24} />,
    'mpc3':      <FaLayerGroup      size={24} />,
    'mpc4':      <FaLayerGroup      size={24} />,
    'middleman_b': <FaUserSecret    size={24} />,
    'http_call_top': <FaExchangeAlt size={24} />,
    'http_call_bot': <FaExchangeAlt size={24} />,

    // New diagram nodes
    'g1-user-navigate':       <FaUser        size={24} />, // User navigating to CEX dashboard
    'g1-generate-apikey':     <FaKey         size={24} />, // Generating APIKey
    'g1-input-apikey':        <FaPuzzlePiece size={24} />, // Inputting into Bluvo Widget
    'g1-provide-walletid':    <FaWallet      size={24} />, // Providing walletId
    'g2-open-popup':          <FaPuzzlePiece size={24} />, // Opening popup with Bluvo Widget
    'g2-user-login':          <FaUser        size={24} />, // User logging in
    'g2-receive-jwt':         <FaLock        size={24} />, // Receiving JWT
    'g2-provide-walletid-jwt': <FaWallet     size={24} />, // Providing walletId with JWT
    'g3-open-popup':          <FaPuzzlePiece size={24} />, // Opening popup with Bluvo Widget
    'g3-user-login':          <FaUser        size={24} />, // User logging in
    'g3-receive-jwt':         <FaLock        size={24} />, // Receiving JWT
    'g3-generate-apikey':     <FaKey         size={24} />, // Generating APIKey from JWT
    'g3-provide-walletid-apikey': <FaWallet  size={24} />, // Providing walletId with APIKey
};
export const ICON_TITLES = {
    // OAuth2 / CEX flow
    'user':         'User',
    'oauthServer':  'OAuth2 Server',
    'db':           'Token DB',
    'clientApp':    'Client App',
    'ottService':   'OTT Service',
    'depositUI':    'Deposit UI',
    'twoFA':        '2FA Service',
    'txService':    'Transaction Service',
    'cond':         'Result?',
    'notification': 'Notifier',
    'endSuccess':   'Success',
    'endFailure':   'Failure',

    // merged IDs
    'oauth':     'OAuth2 Server',
    'client':    'Client App',
    'tx':        'Transaction Service',
    'success':   'Success',
    'failure':   'Failure',

    // Bluvo flow
    'widget':    'Bluvo Widget',
    'ott':       'OTT Endpoint',
    'user_b':    'User',
    'depositUI_b': 'Deposit UI',
    'success_b': 'Success',
    'failure_b': 'Failure',

    // Previous diagram nodes
    'service':   'Service',
    'loader':    'Loader Function',
    'middleman': 'Malicious Actor',
    'service_b': 'Service',
    'signer':    'Signer Node',
    'mpc1':      'MPC Node A',
    'mpc2':      'MPC Node B',
    'mpc3':      'MPC Node C',
    'mpc4':      'MPC Node D',
    'middleman_b': 'Malicious Actor',
    'http_call_top': 'Exchange',
    'http_call_bot': 'Exchange',

    // New diagram nodes (shortened titles)
    'g1-user-navigate':       'Navigate to CEX',
    'g1-generate-apikey':     'Generate APIKey',
    'g1-input-apikey':        'Input APIKey',
    'g1-provide-walletid':    'Provides walletId',
    'g2-open-popup':          'Open CEX popup',
    'g2-user-login':          'Log in to CEX',
    'g2-receive-jwt':         'Receive JWT',
    'g2-provide-walletid-jwt': 'Provides walletId (JWT)',
    'g3-open-popup':          'Open CEX popup',
    'g3-user-login':          'Log in to CEX',
    'g3-receive-jwt':         'Receive JWT',
    'g3-generate-apikey':     'Generate APIKey from JWT',
    'g3-provide-walletid-apikey': 'Provides walletId (APIKey)',
};