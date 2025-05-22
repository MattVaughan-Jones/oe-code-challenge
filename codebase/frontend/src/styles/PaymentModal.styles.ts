export const styles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },

  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '24px',
    width: '90%',
    maxWidth: '500px',
    position: 'relative' as const,
  },

  closeButton: {
    position: 'absolute' as const,
    right: '24px',
    top: '24px',
    border: 'none',
    background: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: 0,
    lineHeight: 1,
  },

  title: {
    marginTop: 0,
    marginBottom: '24px',
  },

  inputGroup: {
    marginBottom: '24px',
  },

  label: {
    display: 'block',
    marginBottom: '8px',
  },

  input: {
    width: '100%',
    padding: '8px',
    border: '2px solid #000',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box' as const,
  },

  cardDetailsRow: {
    display: 'flex',
    gap: '12px',
  },

  halfWidthInput: {
    flex: 'none',
    width: 'calc(50% - 6px)',
    padding: '8px',
    border: '2px solid #000',
    borderRadius: '8px',
    fontSize: '16px',
    boxSizing: 'border-box' as const,
  },
}
