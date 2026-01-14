'use client'
import React, { useEffect, useState } from 'react'

const LoadingSpinner = () => {
    const [dot, setDot] = useState('.');

    useEffect(() => {
        const interval = setInterval(() => {
            setDot(prev => prev.length < 3 ? prev + '.' : '.');
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className='w-full h-full flex flex-col justify-center items-center text-3xl gap-4'>
            <div className="animate-spin rounded-full h-10 w-10 border-b-5 border-(--text-color) mx-auto mb-2"></div>
            <p className="text-(--text-color) text-2xl">Loading{dot}</p>
        </div>
    )
}

export default LoadingSpinner
