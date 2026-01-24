import "./Layout.css";
export default function Layout({ header, sidebar, children }) {

  return (
    <div className="layout">
      <header className="layout-header">{header}</header>
      <aside className="layout-sidebar">{sidebar}</aside>
      <main className="layout-main">{children}</main>
    </div>
  );
}