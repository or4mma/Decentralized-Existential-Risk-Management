;; Species Backup Coordination Contract
;; Coordinates backups of species data across multiple locations

(define-data-var admin principal tx-sender)
(define-map species-records
  { species-id: uint }
  {
    name: (string-ascii 100),
    genetic-hash: (buff 32),
    conservation-status: (string-ascii 20)
  }
)
(define-map backup-locations
  { location-id: uint }
  {
    name: (string-ascii 100),
    coordinates: (string-ascii 50),
    security-level: uint
  }
)
(define-map species-backups
  { species-id: uint, location-id: uint }
  {
    backup-date: uint,
    genetic-sample-count: uint,
    verified: bool
  }
)
(define-data-var next-species-id uint u1)
(define-data-var next-location-id uint u1)

;; Register a new species
(define-public (register-species
    (name (string-ascii 100))
    (genetic-hash (buff 32))
    (conservation-status (string-ascii 20)))
  (let ((species-id (var-get next-species-id)))
    (begin
      (map-set species-records
        { species-id: species-id }
        {
          name: name,
          genetic-hash: genetic-hash,
          conservation-status: conservation-status
        })
      (var-set next-species-id (+ species-id u1))
      (ok species-id))))

;; Register a new backup location
(define-public (register-backup-location
    (name (string-ascii 100))
    (coordinates (string-ascii 50))
    (security-level uint))
  (let ((location-id (var-get next-location-id)))
    (begin
      (map-set backup-locations
        { location-id: location-id }
        {
          name: name,
          coordinates: coordinates,
          security-level: security-level
        })
      (var-set next-location-id (+ location-id u1))
      (ok location-id))))

;; Record a species backup
(define-public (record-species-backup
    (species-id uint)
    (location-id uint)
    (genetic-sample-count uint))
  (begin
    (map-set species-backups
      { species-id: species-id, location-id: location-id }
      {
        backup-date: block-height,
        genetic-sample-count: genetic-sample-count,
        verified: false
      })
    (ok true)))

;; Verify a species backup
(define-public (verify-species-backup
    (species-id uint)
    (location-id uint))
  (match (map-get? species-backups { species-id: species-id, location-id: location-id })
    backup (begin
      (map-set species-backups
        { species-id: species-id, location-id: location-id }
        (merge backup { verified: true }))
      (ok true))
    (err u404)))

;; Get species details
(define-read-only (get-species-details (species-id uint))
  (map-get? species-records { species-id: species-id }))

;; Get backup location details
(define-read-only (get-location-details (location-id uint))
  (map-get? backup-locations { location-id: location-id }))

;; Get species backup details
(define-read-only (get-backup-details (species-id uint) (location-id uint))
  (map-get? species-backups { species-id: species-id, location-id: location-id }))

