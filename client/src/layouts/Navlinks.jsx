const NavLinks = () => (
    <div className="">
      {filteredNav.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          onClick={() => setMobileOpen(false)}
          className=""
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
      <Separator className="" />
      <button
        onClick={handleLogout}
        className=""
      >
        <LogOut className="h-4 w-4" />
        Logout 
      </button>
    </div>
  );