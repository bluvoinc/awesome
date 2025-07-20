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
    user_b:    <FaUser            size={24} />,        // missing
    depositUI_b: <FaWallet        size={24} />,        // missing
    success_b: <FaCheckCircle     size={24} />,        // missing
    failure_b: <FaTimesCircle     size={24} />,        // missing
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
    user_b:    'User',            // missing
    depositUI_b: 'Deposit UI',    // missing
    success_b: 'Success',         // missing
    failure_b: 'Failure',         // missing
};
