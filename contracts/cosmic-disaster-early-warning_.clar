;; Cosmic Disaster Early Warning Contract
;; Provides early warnings for cosmic disasters

(define-data-var admin principal tx-sender)
(define-map warning-systems
  { system-id: uint }
  {
    name: (string-ascii 100),
    disaster-type: (string-ascii 50),
    location: (string-ascii 100)
  }
)
(define-map disaster-warnings
  { warning-id: uint }
  {
    system-id: uint,
    disaster-type: (string-ascii 50),
    severity: uint,
    probability: uint,
    status: (string-ascii 20)
  }
)
(define-data-var next-system-id uint u1)
(define-data-var next-warning-id uint u1)

;; Register a new early warning system
(define-public (register-warning-system
    (name (string-ascii 100))
    (disaster-type (string-ascii 50))
    (location (string-ascii 100)))
  (let ((system-id (var-get next-system-id)))
    (begin
      (map-set warning-systems
        { system-id: system-id }
        {
          name: name,
          disaster-type: disaster-type,
          location: location
        })
      (var-set next-system-id (+ system-id u1))
      (ok system-id))))

;; Issue a disaster warning
(define-public (issue-warning
    (system-id uint)
    (disaster-type (string-ascii 50))
    (severity uint)
    (probability uint))
  (let ((warning-id (var-get next-warning-id)))
    (begin
      (map-set disaster-warnings
        { warning-id: warning-id }
        {
          system-id: system-id,
          disaster-type: disaster-type,
          severity: severity,
          probability: probability,
          status: "issued"
        })
      (var-set next-warning-id (+ warning-id u1))
      (ok warning-id))))

;; Update warning status
(define-public (update-warning-status
    (warning-id uint)
    (new-status (string-ascii 20)))
  (match (map-get? disaster-warnings { warning-id: warning-id })
    warning (begin
      (map-set disaster-warnings
        { warning-id: warning-id }
        (merge warning { status: new-status }))
      (ok true))
    (err u404)))

;; Get warning system details
(define-read-only (get-warning-system (system-id uint))
  (map-get? warning-systems { system-id: system-id }))

;; Get disaster warning details
(define-read-only (get-warning-details (warning-id uint))
  (map-get? disaster-warnings { warning-id: warning-id }))

;; Calculate threat level (severity * probability)
(define-read-only (calculate-threat-level (warning-id uint))
  (match (map-get? disaster-warnings { warning-id: warning-id })
    warning (ok (* (get severity warning) (get probability warning)))
    (err u404)))

