import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  componentDidCatch(error, info) {
    this.setState({ error, info })
    // also log to console for dev
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    const { error, info } = this.state
    if (error) {
      return (
        <div style={{ padding: 20 }}>
          <h2>Application Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{String(error && error.toString())}</pre>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{info?.componentStack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
