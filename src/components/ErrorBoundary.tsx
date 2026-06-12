import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  handleReset = () => {
    localStorage.removeItem("nuvio-tycoon-save");
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-dvh flex-col items-center justify-center gap-6 bg-background px-8 text-center text-foreground">
          <div className="text-5xl">⚠️</div>
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-accent">LADEFEHLER</p>
            <h1 className="mt-2 text-xl font-black">Spielstand konnte nicht geladen werden</h1>
            <p className="mt-2 text-sm text-muted">
              Der gespeicherte Spielstand ist inkompatibel mit dieser Version.
            </p>
          </div>
          <button
            onClick={this.handleReset}
            className="rounded-2xl bg-accent px-8 py-3 text-sm font-black text-accent-foreground"
          >
            Spielstand zurücksetzen & neu starten
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
