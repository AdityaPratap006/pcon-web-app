import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';

const CustomButton = (props) => {
    const linkRef = useRef();
    const btnRef = useRef();
    const [touchHover, setTouchHover] = useState(false);

    const toggleTouchHover = () => {
        setTouchHover(prev => !prev);
    }

    const touchStartHandler = useCallback((e) => {
        e.preventDefault();
        toggleTouchHover();
    }, []);

    const touchEndHandler = useCallback((e) => {
        e.preventDefault();
        setTimeout(() => {
            toggleTouchHover();
        }, 100);
    }, []);

    const { to, href } = props;
    useEffect(() => {
        if (href) {
            return;
        }

        if (to) {
            linkRef.current.ontouchstart = touchStartHandler;
            linkRef.current.ontouchend = touchEndHandler;
        } else {
            btnRef.current.ontouchstart = touchStartHandler;
            btnRef.current.ontouchend = touchEndHandler;
        }

    }, [to, href, touchStartHandler, touchEndHandler]);

    if (props.href) {
        return (
            <a target="_blank" rel="noopener noreferrer" href={props.href} className={`${styles['btn']} ${styles['link']} ${props.light ? styles['light'] : null} ${touchHover ? styles['touch-hover'] : null} ${props.className}`}>
                {props.children}
            </a>
        );
    }


    return props.to ? (
        <Link ref={linkRef} to={props.to} className={`${styles['btn']} ${styles['link']} ${props.light ? styles['light'] : null} ${touchHover ? styles['touch-hover'] : null} ${props.className}`}>
            {props.children}
        </Link>

    ) : (
            <button ref={btnRef} {...props} className={`${styles['btn']} ${props.light ? styles['light'] : null} ${touchHover ? styles['touch-hover'] : null} ${props.className}`} >
                {props.children}
            </button>
        );
};

export default CustomButton;
