import { CardProps } from '../../types';

import './Card.css';

const Card: React.FC<CardProps> = ({ children }) => {
  return <div className='card'>{children}</div>;
};

export default Card;
