import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 24,
            textAlign: "center",
            background: "#1b3a2d",
            color: "#fff",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          <div style={{ fontSize: 48 }}>🍵</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            Something went wrong
          </div>
          <div style={{ color: "#9cc0ac", maxWidth: 320, lineHeight: 1.6 }}>
            Please reload the page. If the problem continues, ask a staff member
            for help.
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              background: "#40916c",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "12px 24px",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
