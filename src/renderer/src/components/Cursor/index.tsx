import './index.css'

export function Cursor({ children, ...props }: React.ComponentProps<'div'>) {
  return (
    <div {...props} className="cursor">
      <div className="cursor-text">{children}</div>
    </div>
  )
}
