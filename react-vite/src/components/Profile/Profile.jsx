import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProfile } from '../../redux/profileActions';
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const user = useSelector((state) => state.session.user);
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  
  const formatCurrency = (value) => {
    const number = parseFloat(value);
    return Number.isInteger(number) ? `$${number}` : `$${number.toFixed(2)}`;
  };
  
  const totalEquity = profile.stocks.reduce((total, stock) => {
    return total + (stock.quantity * stock.current_price);
  }, 0);
  
  const totalBalance = parseFloat(profile.balance.toFixed(2)) + parseFloat(totalEquity.toFixed(2));

  return (
    <div className='profile-page'>
      <h2>{user.first_name} {user.last_name}</h2>
      <p>Cash: {formatCurrency(profile.balance)}</p>
      <p>Stocks: {formatCurrency(totalEquity)}</p>
      <p>Total Balance: {formatCurrency(totalBalance)}</p>
      <h3>Stocks</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Symbol</th>
            <th>Shares</th>
            <th>Price</th>
            <th>Average Cost</th>
            <th>Total Return</th>
            <th>Equity</th>
          </tr>
        </thead>
        <tbody>
          {profile.stocks.map((stock) => {
            const equity = stock.quantity * stock.current_price;
            const totalReturn = (stock.current_price - stock.average_cost) * stock.quantity;
            return (
              <tr key={stock.id}>
                <td>{stock.name}</td>
                <td>{stock.symbol}</td>
                <td>{stock.quantity}</td>
                <td>{formatCurrency(stock.current_price)}</td>
                <td>{formatCurrency(stock.average_cost)}</td>
                <td>{formatCurrency(totalReturn)}</td>
                <td>{formatCurrency(equity)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Profile;
