import UserTradeRow from "../components/UserTradeRow";
import { FAKE_DATA } from "../data/placeholderData";

const CommunityPage = () => {
  return (
    <div>
      <h1>Community Page</h1>
      <h2>Available Trades:</h2>

      {FAKE_DATA.map((user) => (
        <UserTradeRow key={user.id} user={user} />
      ))}
    </div>
  );
};

export default CommunityPage;
