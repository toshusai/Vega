import './index.css'

export function Panel({ children }: { children?: React.ReactNode }) {
  return (
    <div className="panel--root">
      <div className="panel--content">{children}</div>
    </div>
  )
}
