;; Civilization Extinction Prevention Contract
;; Manages coordination of efforts to prevent civilization extinction

(define-data-var admin principal tx-sender)
(define-map extinction-risks
  { risk-id: uint }
  {
    name: (string-ascii 100),
    probability: uint,
    impact: uint,
    status: (string-ascii 20)
  }
)
(define-map risk-mitigators
  { risk-id: uint, mitigator: principal }
  {
    resources-committed: uint,
    responsibility: (string-ascii 100)
  }
)
(define-data-var next-risk-id uint u1)

;; Register a new extinction risk
(define-public (register-extinction-risk
    (name (string-ascii 100))
    (probability uint)
    (impact uint))
  (let ((risk-id (var-get next-risk-id)))
    (begin
      (map-set extinction-risks
        { risk-id: risk-id }
        {
          name: name,
          probability: probability,
          impact: impact,
          status: "identified"
        })
      (var-set next-risk-id (+ risk-id u1))
      (ok risk-id))))

;; Update risk status
(define-public (update-risk-status
    (risk-id uint)
    (new-status (string-ascii 20)))
  (match (map-get? extinction-risks { risk-id: risk-id })
    risk (begin
      (map-set extinction-risks
        { risk-id: risk-id }
        (merge risk { status: new-status }))
      (ok true))
    (err u404)))

;; Register as a mitigator for a specific risk
(define-public (register-as-mitigator
    (risk-id uint)
    (resources-committed uint)
    (responsibility (string-ascii 100)))
  (begin
    (map-set risk-mitigators
      { risk-id: risk-id, mitigator: tx-sender }
      {
        resources-committed: resources-committed,
        responsibility: responsibility
      })
    (ok true)))

;; Get risk details
(define-read-only (get-risk-details (risk-id uint))
  (map-get? extinction-risks { risk-id: risk-id }))

;; Get mitigator details
(define-read-only (get-mitigator-details (risk-id uint) (mitigator principal))
  (map-get? risk-mitigators { risk-id: risk-id, mitigator: mitigator }))

;; Calculate risk score (probability * impact)
(define-read-only (calculate-risk-score (risk-id uint))
  (match (map-get? extinction-risks { risk-id: risk-id })
    risk (ok (* (get probability risk) (get impact risk)))
    (err u404)))

