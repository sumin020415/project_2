import { useState, useRef, useEffect } from 'react';
import styles from './MoreMenu.module.css';

const MoreMenu = ({ onDelete, onEdit }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, []);

    return (
        <div ref={ref} className={styles.wrapper}>
            <button className={styles.icon} onClick={(e) => {e.stopPropagation(); setOpen(o => !o)}}>⋯</button>
            {open && (
                <div className={styles.menu}>
                    <button className={styles.menuItem} onClick={() => { setOpen(false); onEdit(); }}>
                        수정
                    </button>
                    <button className={styles.menuItem} onClick={() => { setOpen(false); onDelete(); }}>
                        삭제
                    </button>
                </div>
            )}
        </div>
    );
};

export default MoreMenu;