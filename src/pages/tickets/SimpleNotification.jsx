import React from 'react';

const SimpleNotification = ({ message }) => {
    if (!message) return null;

    return (
        <div className="fixed top-4 right-4 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden">
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">Nueva notificación</h3>
                    <button className="text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Cerrar</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                <p className="text-sm text-gray-700 mb-4">{message}</p>
            </div>
        </div>
    );
};

export default SimpleNotification;