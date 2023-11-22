import React from 'react'
import styles from './Popup.module.css'
import { Decliker } from '../../../types/decliker'

const Popup = ({ declikers, onClose }: { declikers: Decliker[]; onClose: () => void }) => {
  return (
    <div className={styles.popup}>
      <button className={styles.close} onClick={onClose}>
        X
      </button>
      <h2 className={styles.title}>
        {declikers.length} Decliker{declikers.length > 1 && 's'}
      </h2>
      {declikers
        .sort((a, b) => a.name?.localeCompare(b.name || '') || 0)
        .map((decliker) => (
          <p key={decliker.id}>
            <a
              className={styles.link}
              href={`https://socialdecliksphere.softr.app/declikers-details?recordId=${decliker.id}`}
              target='_blank'
            >
              {decliker.name}
            </a>
          </p>
        ))}
    </div>
  )
}

export default Popup
