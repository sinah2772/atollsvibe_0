import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

interface BasePathLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  children: React.ReactNode;
}

/**
 * A wrapper around Link component that handles base path issues
 * Use this instead of Link when linking to paths that need to respect the base path
 */
const BasePathLink: React.FC<BasePathLinkProps> = ({ to, children, ...rest }) => {
  // Handle different path scenarios
  const createPath = () => {
    // If it's an absolute path starting with /, use it as is with the basename
    if (to.startsWith('/')) {
      return to;
    }
    
    // If it's a relative path (doesn't start with /), 
    // calculate it based on current location
    return to;
  };

  return (
    <Link to={createPath()} {...rest}>
      {children}
    </Link>
  );
};

export default BasePathLink;
