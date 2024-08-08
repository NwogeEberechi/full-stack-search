interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = (props) => {
  return (
    <div className="App">
      <div className="container">
        <div className="row height d-flex justify-content-center align-items-center">
          <div className="col-md-6">{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
