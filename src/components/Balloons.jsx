import './Balloons.css';

const Balloons = () => {
  const balloons = [
    { color: '#ff6b9d', delay: 0, left: '10%' },
    { color: '#c44569', delay: 2, left: '20%' },
    { color: '#ffeaa7', delay: 1, left: '80%' },
    { color: '#74b9ff', delay: 3, left: '90%' },
    { color: '#a29bfe', delay: 1.5, left: '15%' },
    { color: '#fd79a8', delay: 2.5, left: '85%' },
    { color: '#fdcb6e', delay: 0.5, left: '25%' },
    { color: '#e17055', delay: 3.5, left: '75%' },
  ];

  return (
    <div className="balloons-container">
      {balloons.map((balloon, index) => (
        <div
          key={index}
          className="balloon"
          style={{
            left: balloon.left,
            animationDelay: `${balloon.delay}s`,
          }}
        >
          <div 
            className="balloon-body"
            style={{ backgroundColor: balloon.color }}
          >
            <div className="balloon-highlight"></div>
          </div>
          <div className="balloon-string"></div>
        </div>
      ))}
    </div>
  );
};

export default Balloons;
