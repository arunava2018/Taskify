import * as React from "react"
import { Link} from "react-router-dom"
import type { LinkProps } from "react-router-dom"

export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, ...props }, ref) => <Link ref={ref} to={to} {...props} />
)

LinkButton.displayName = "LinkButton"
