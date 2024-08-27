

function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <div style={{
          position: "absolute",
          top: "25%",
          left: "5%",
          transform: "translate(-50% )",
          fontSize: '2em'
        }}>
          <span style={{ color: "#4285F4" }}>Search For User</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50% )",
          }}
        >
          {/*<SearchBar query={query} setQuery={setQuery}/>*/} {/* causes the page not to load*/}
        </div>
      </div>
    );
  }