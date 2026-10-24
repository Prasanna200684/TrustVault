(function () {
    var $ = function (id) {
        return document.getElementById(id);
    };

    var ic = {
        dash: '<path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/>',
        docs: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h8"/>',
        search: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
        cat: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M4 15h16M10 4v16M15 4v16"/>',
        up: '<path d="M12 5v14M5 12h14"/>',
        log: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
        shield: '<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="m9.5 9.5 5 5M14.5 9.5l-5 5"/>',
        safe: '<path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6z"/><path d="m8.5 12 2.5 2.5L15.5 10"/>'
    };

    var cats = [
        "Finance", "HR", "Legal", "IT",
        "Education", "Personal", "General", "Other"
    ];

    var cico = {
        Finance: '<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/>',
        HR: '<circle cx="9" cy="8" r="3"/><path d="M3 19c.6-3 3-4.5 6-4.5s5.4 1.5 6 4.5"/><circle cx="17" cy="9" r="2.3"/>',
        Legal: '<path d="M12 4v16M6 20h12M5 8h14"/><path d="m5 8-2.5 6a3 3 0 0 0 5 0zM19 8l-2.5 6a3 3 0 0 0 5 0z"/>',
        IT: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
        Education: '<path d="m2 9 10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
        Personal: '<circle cx="12" cy="8" r="4"/><path d="M4 20c1-4 4-6 8-6s7 2 8 6"/>',
        General: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
        Other: '<circle cx="6" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="18" cy="12" r="1.5"/>'
    };

    var tabs = [
        ["dash", "Dashboard"],
        ["docs", "My Documents"],
        ["search", "Search Documents"],
        ["cat", "Categories"],
        ["up", "Upload Document"],
        ["log", "Activity Logs"]
    ];

    var need = {
        dash: ["admin"],
        log: ["admin"],
        up: ["admin", "owner"]
    };

    var ALLOWED = [
        "pdf", "txt", "docx", "xlsx",
        "csv", "png", "jpg", "jpeg"
    ];

    var docs = [
        {
            id: 1,
            t: "Q4 Board Report",
            desc: "Quarterly results for the board.",
            ext: "pdf",
            s: 2400,
            c: "Finance",
            o: "Priya Nair",
            d: "2026-10-18"
        },
        {
            id: 2,
            t: "Vendor Contract",
            desc: "Signed agreement with the cloud vendor.",
            ext: "docx",
            s: 380,
            c: "Legal",
            o: "Priya Nair",
            d: "2026-10-15"
        },
        {
            id: 3,
            t: "Security Audit",
            desc: "Findings from the annual IT audit.",
            ext: "pdf",
            s: 1800,
            c: "IT",
            o: "Dev Patel",
            d: "2026-10-12"
        },
        {
            id: 4,
            t: "Hiring Plan 2027",
            desc: "Headcount and budget by team.",
            ext: "xlsx",
            s: 220,
            c: "HR",
            o: "Ana Torres",
            d: "2026-10-09"
        },
        {
            id: 5,
            t: "Course Notes",
            desc: "Lecture notes for the training week.",
            ext: "txt",
            s: 40,
            c: "Education",
            o: "Marcus Lee",
            d: "2026-10-05"
        }
    ];

    var logs = [
        ["10:42", "Priya Nair", "Logged in"],
        ["10:47", "Priya Nair", "Uploaded Q4 Board Report"],
        ["11:03", "Priya Nair", "Shared with Marcus Lee"],
        ["11:20", "Dev Patel", "Access denied: Activity Logs"],
        ["11:58", "Marcus Lee", "Logged out"]
    ];

    var accounts = [];
    var user = { name: "Admin", role: "admin" };
    var cur = "dash";
    var nid = 10;
    var lay = "grid";
    var preCat = "";
    var mode = "in";

    function esc(s) {
        return String(s).replace(/[&<>"]/g, function (c) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;"
            }[c];
        });
    }

    function toast(t) {
        var e = $("toast");
        e.textContent = t;
        e.hidden = false;
        clearTimeout(toast.t);

        toast.t = setTimeout(function () {
            e.hidden = true;
        }, 3000);
    }

    function now() {
        return new Date().toTimeString().slice(0, 5);
    }

    function fmt(k) {
        return k >= 1024
            ? (k / 1024).toFixed(1) + " MB"
            : k + " KB";
    }

    function ok(v) {
        return !need[v] || need[v].indexOf(user.role) !== -1;
    }

    function title(v) {
        var result = tabs.filter(function (t) {
            return t[0] === v;
        });

        return result.length ? result[0][1] : v;
    }

    function mine() {
        return docs.filter(function (d) {
            return user.role === "admin" || d.o === user.name;
        });
    }

    function svg(p, c) {
        return '<svg viewBox="0 0 24 24"' +
            (c ? ' class="' + c + '"' : '') +
            ' aria-hidden="true">' + p + '</svg>';
    }

    function table(h, r) {
        return '<div class="tw"><table><thead><tr>' +
            h.map(function (x) {
                return "<th>" + x + "</th>";
            }).join("") +
            "</tr></thead><tbody>" + r +
            "</tbody></table></div>";
    }

    function row(d, act) {
        return "<tr><td>" + esc(d.t) + "." + d.ext +
            "</td><td>" + esc(d.c) +
            "</td><td>" + esc(d.o) +
            "</td><td>" + d.d +
            "</td><td>" + fmt(d.s) +
            "</td>" +
            (act
                ? '<td><div class="act">' +
                  '<button class="btn sec sm" data-share="' +
                  d.id + '">Share</button>' +
                  '<button class="btn danger sm" data-del="' +
                  d.id + '">Delete</button></div></td>'
                : "") +
            "</tr>";
    }

    function card(d) {
        return '<div class="dc"><div class="dh">' +
            '<span class="ext">' + d.ext.toUpperCase() +
            '</span><span class="pill">' + esc(d.c) +
            "</span></div><h3>" + esc(d.t) +
            '</h3><p class="dd">' + esc(d.desc || "No description") +
            '</p><div class="dm">' + esc(d.o) + " · " + d.d +
            " · " + fmt(d.s) +
            '</div><div class="act">' +
            '<button class="btn sec sm" data-share="' + d.id +
            '">Share</button>' +
            '<button class="btn danger sm" data-del="' + d.id +
            '">Delete</button></div></div>';
    }

    function empty(msg) {
        return '<div class="empty">' + svg(ic.docs) +
            '<h3>No documents found</h3><p>' + msg + "</p>" +
            (ok("up")
                ? '<button class="btn" data-v="up">+ Upload Your First Document</button>'
                : "") +
            "</div>";
    }

    function nav() {
        $("nav").innerHTML = tabs.map(function (t) {
            return '<button data-v="' + t[0] + '" class="' +
                (t[0] === cur ? "on" : "") + '">' +
                svg(ic[t[0]]) + t[1] +
                (ok(t[0]) ? "" : svg(ic.lock, "lk")) +
                "</button>";
        }).join("");
    }

    function docList(q) {
        var l = mine().filter(function (d) {
            return d.t.toLowerCase().indexOf(q) > -1;
        });

        $("count").textContent = l.length + " document(s)";

        $("list").innerHTML = !l.length
            ? empty(q
                ? "No documents match that title."
                : "Your vault is currently empty.")
            : lay === "grid"
                ? '<div class="dgrid">' +
                  l.map(card).join("") + "</div>"
                : table(
                    ["Title", "Category", "Owner", "Date", "Size", "Actions"],
                    l.map(function (d) {
                        return row(d, 1);
                    }).join("")
                );
    }

    function opts(sel) {
        return cats.map(function (c) {
            return '<option' +
                (c === sel ? " selected" : "") +
                ">" + c + "</option>";
        }).join("");
    }

    var views = {
        dash: function () {
            var n = docs.length;

            return '<h2>Dashboard</h2>' +
                '<p class="sub">Overview of your secure workspace.</p>' +
                '<div class="grid">' +
                '<div class="card"><div class="n">' + n +
                '</div><div class="l">Documents uploaded</div></div>' +
                '<div class="card"><div class="n">' +
                (4 + accounts.length) +
                '</div><div class="l">Registered users</div></div>' +
                '<div class="card"><div class="n">9</div>' +
                '<div class="l">Documents shared</div></div>' +
                '<div class="card"><div class="n">' + logs.length +
                '</div><div class="l">Activity events today</div></div>' +
                '<div class="card"><div class="n">Demo</div>' +
                '<div class="l">Security status</div></div>' +
                '</div><div class="sechead"><h3>Recent documents</h3></div>' +
                table(
                    ["Title", "Category", "Owner", "Date", "Size"],
                    docs.slice(0, 3).map(function (d) {
                        return row(d, 0);
                    }).join("")
                );
        },

        docs: function () {
            return '<div class="head"><div><h2>My Documents</h2>' +
                '<p class="sub">View, organize and manage your documents.</p>' +
                '</div>' +
                (ok("up")
                    ? '<button class="btn" data-v="up">+ Upload Document</button>'
                    : "") +
                '</div><div class="box searchbar">' +
                '<input id="q" placeholder="Search documents by title..." aria-label="Search documents by title">' +
                '<button class="btn" id="qb">Search</button>' +
                '</div><div class="sechead"><div>' +
                '<h3 style="font-size:1.5rem">All Documents</h3>' +
                '<p>Your documents in one place.</p></div>' +
                '<div class="rt"><span class="count" id="count"></span>' +
                '<div class="seg" role="group" aria-label="Layout">' +
                '<button data-lay="grid" class="' +
                (lay === "grid" ? "on" : "") + '">Grid</button>' +
                '<button data-lay="list" class="' +
                (lay === "list" ? "on" : "") + '">List</button>' +
                '</div></div></div><div id="list"></div>';
        },

        search: function () {
            return '<h2>Search Documents</h2>' +
                '<p class="sub">Filter by title, category, owner or date.</p>' +
                '<div class="filters">' +
                '<div><label for="q1">Title</label><input id="q1"></div>' +
                '<div><label for="q2">Category</label><select id="q2">' +
                '<option value="">All</option>' + opts(preCat) +
                '</select></div>' +
                '<div><label for="q3">Owner</label><input id="q3"></div>' +
                '<div><label for="q4">Uploaded after</label>' +
                '<input id="q4" type="date"></div></div>' +
                '<div id="res" style="margin-top:22px"></div>';
        },

        cat: function () {
            return '<h2>Categories</h2>' +
                '<p class="sub">Browse your documents by folder.</p>' +
                '<div class="grid">' +
                cats.map(function (k) {
                    var n = mine().filter(function (d) {
                        return d.c === k;
                    }).length;

                    return '<button class="card cat" data-cat="' + k + '">' +
                        svg(cico[k]) + '<h3>' + k + '</h3>' +
                        '<div class="l">' + n + ' files</div></button>';
                }).join("") +
                "</div>";
        },

        up: function () {
            return '<h2>Upload Document</h2>' +
                '<p class="sub">Add a file to your vault.</p>' +
                '<div class="box panel">' +
                '<label for="ut" style="margin-top:0">Document title</label>' +
                '<input id="ut" maxlength="80">' +
                '<div class="err" id="e_ut" role="alert"></div>' +
                '<label for="ud">Description</label>' +
                '<textarea id="ud" maxlength="200"></textarea>' +
                '<label for="uc">Category</label>' +
                '<select id="uc"><option value="">Select a category</option>' +
                opts("") + '</select>' +
                '<div class="err" id="e_uc" role="alert"></div>' +
                '<label for="uf">File</label>' +
                '<input id="uf" type="file" accept=".pdf,.txt,.docx,.xlsx,.csv,.png,.jpg,.jpeg">' +
                '<div class="hint">Supported files up to 10 MB.</div>' +
                '<div class="err" id="e_uf" role="alert"></div>' +
                '<button class="btn" id="upb" style="margin-top:22px">Upload document</button>' +
                '</div>';
        },

        log: function () {
            return '<h2>Activity Logs</h2>' +
                '<p class="sub">Logins and document actions. Admin only.</p>' +
                table(
                    ["Time", "User", "Action"],
                    logs.map(function (l) {
                        return "<tr><td>" + esc(l[0]) +
                            "</td><td>" + esc(l[1]) +
                            "</td><td>" + esc(l[2]) + "</td></tr>";
                    }).join("")
                );
        },

        set: function () {
            return '<h2>Profile and password</h2>' +
                '<div class="box panel">' +
                '<label for="p1">New password</label>' +
                '<input id="p1" type="password">' +
                '<label for="p2">Confirm password</label>' +
                '<input id="p2" type="password">' +
                '<button class="btn" id="sv">Save changes</button></div>';
        }
    };

    function bad(id, m) {
        var e = $("e_" + id);

        if (e) {
            e.textContent = m || "";
        }

        var field = $(id);

        if (field) {
            field.classList.toggle("bad", !!m);
            field.setAttribute("aria-invalid", m ? "true" : "false");
        }

        return !m;
    }

    var rx = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

    var VAL = {
        si: function () {
            var v = $("si").value.trim();

            return bad(
                "si",
                !v ? "Enter your username or email."
                    : v.indexOf("@") > -1 && !rx.test(v)
                        ? "Enter a valid email address."
                        : v.length < 3
                            ? "Username must be at least 3 characters."
                            : ""
            );
        },

        sp: function () {
            return bad("sp", $("sp").value ? "" : "Enter your password.");
        },

        ru: function () {
            var v = $("ru").value.trim();

            return bad(
                "ru",
                !v ? "Choose a username."
                    : !/^[A-Za-z0-9_.]{3,20}$/.test(v)
                        ? "Use 3 to 20 letters, numbers, dots or underscores."
                        : v.toLowerCase() === "admin"
                            ? "That username is reserved."
                            : accounts.some(function (a) {
                                return a.u.toLowerCase() === v.toLowerCase();
                            })
                                ? "That username is already taken."
                                : ""
            );
        },

        re: function () {
            var v = $("re").value.trim();

            return bad(
                "re",
                !v ? "Enter your email."
                    : !rx.test(v) ? "Enter a valid email address."
                        : ""
            );
        },

        rp: function () {
            var v = $("rp").value;

            return bad(
                "rp",
                !v ? "Create a password."
                    : v.length < 8 ? "Use at least 8 characters."
                        : !/[A-Za-z]/.test(v) || !/\d/.test(v)
                            ? "Include at least one letter and one number."
                            : ""
            );
        },

        rc: function () {
            var v = $("rc").value;

            return bad(
                "rc",
                !v ? "Confirm your password."
                    : v !== $("rp").value ? "Passwords do not match."
                        : ""
            );
        }
    };

    function fld(id, label, type, autocomplete) {
        return '<label for="' + id + '">' + label + '</label>' +
            '<input id="' + id + '" type="' + type +
            '" autocomplete="' + autocomplete + '">' +
            '<div class="err" id="e_' + id + '" role="alert"></div>';
    }

    function setMode(m) {
        mode = m;

        $("t1").setAttribute("aria-selected", m === "in");
        $("t2").setAttribute("aria-selected", m === "up");
        $("ok").hidden = true;

        $("af").innerHTML = m === "in"
            ? fld("si", "Username or email", "text", "username") +
              fld("sp", "Password", "password", "current-password") +
              '<label for="role">Preview as</label>' +
              '<select id="role">' +
              '<option value="admin">Admin</option>' +
              '<option value="owner">Owner</option>' +
              '<option value="viewer">Viewer</option>' +
              '</select><div class="hint">Demo login: use username admin to open Admin pages.</div>' +
              '<button class="btn" type="submit">Sign in</button>'
            : fld("ru", "Username", "text", "username") +
              fld("re", "Email", "email", "email") +
              fld("rp", "Password", "password", "new-password") +
              fld("rc", "Confirm password", "password", "new-password") +
              '<button class="btn" type="submit">Create account</button>';
    }

    function start(u) {
        user = u;
        $("login").hidden = true;

        var c = $("chk");
        var l = $("cl");
        var s = [
            "Verifying credentials",
            "Preparing session",
            "Checking role permissions"
        ];

        c.hidden = false;
        l.innerHTML = "";

        s.forEach(function (x, i) {
            setTimeout(function () {
                l.innerHTML += "<li>" + x + "</li>";
            }, i * 450);
        });

        setTimeout(function () {
            c.hidden = true;
            $("av").textContent = user.name.charAt(0).toUpperCase();

            logs.push([now(), user.name, "Logged in"]);

            $("app").hidden = false;
            $("app").classList.remove("min", "open");

            show(user.role === "admin" ? "dash" : "docs");

            toast("Signed in successfully.");
        }, s.length * 450 + 300);
    }

    function show(v) {
        cur = v;
        nav();

        var m = document.querySelector(".main");

        if (m) {
            m.scrollTop = 0;
        }

        $("app").classList.remove("open");
        clearTimeout(show.t);

        if (!ok(v)) {
            $("view").innerHTML =
                '<div class="deny">' +
                svg(ic.shield) +
                '<h3>Access denied</h3>' +
                '<span class="code">403 Restricted route</span>' +
                '<p>Your role (' + esc(user.role) +
                ') cannot open ' + esc(title(v)) + '.</p>' +
                '<button class="btn" data-v="docs">Back to My Documents</button>' +
                '</div>';

            logs.push([now(), user.name, "Access denied: " + title(v)]);
            return;
        }

        if (!views[v]) {
            $("view").innerHTML = "<h2>Page not found</h2>";
            return;
        }

        $("view").innerHTML = views[v]();

        if (v === "docs") {
            var run = function () {
                docList($("q").value.toLowerCase());
            };

            $("qb").onclick = run;
            $("q").addEventListener("input", run);
            run();
        }

        if (v === "search") {
            var go = function () {
                var a = $("q1").value.toLowerCase();
                var b = $("q2").value;
                var c = $("q3").value.toLowerCase();
                var d = $("q4").value;

                var r = mine().filter(function (x) {
                    return x.t.toLowerCase().indexOf(a) > -1 &&
                        (!b || x.c === b) &&
                        x.o.toLowerCase().indexOf(c) > -1 &&
                        (!d || x.d > d);
                });

                $("res").innerHTML = r.length
                    ? table(
                        ["Title", "Category", "Owner", "Date", "Size"],
                        r.map(function (x) {
                            return row(x, 0);
                        }).join("")
                    )
                    : '<div class="empty"><h3>No documents found</h3></div>';
            };

            ["q1", "q2", "q3", "q4"].forEach(function (id) {
                $(id).addEventListener("input", go);
            });

            go();
        }

        if (v === "up") {
            $("upb").onclick = function () {
                var t = $("ut").value.trim();
                var c = $("uc").value;
                var f = $("uf").files[0];
                var ext = f ? f.name.split(".").pop().toLowerCase() : "";

                var a = bad("ut", !t ? "Enter a document title." : "");
                var b = bad("uc", c ? "" : "Choose a category.");

                var d = bad(
                    "uf",
                    !f ? "Choose a file."
                        : ALLOWED.indexOf(ext) < 0
                            ? "This file type is not supported."
                            : f.size > 10 * 1024 * 1024
                                ? "File is larger than 10 MB."
                                : ""
                );

                if (!(a && b && d)) {
                    return;
                }

                docs.unshift({
                    id: nid++,
                    t: t,
                    desc: $("ud").value.trim(),
                    ext: ext,
                    s: Math.max(1, Math.ceil(f.size / 1024)),
                    c: c,
                    o: user.name,
                    d: new Date().toISOString().slice(0, 10)
                });

                logs.push([now(), user.name, "Uploaded " + t]);

                toast("Demo record added.");
                show("docs");
            };
        }

        if (v === "set") {
            $("sv").onclick = function () {
                if ($("p1").value !== $("p2").value) {
                    toast("Passwords do not match.");
                } else {
                    toast("Demo only: password was not changed.");
                }
            };
        }
    }

    document.addEventListener("click", function (e) {
        var b = e.target.closest("button");

        if (!b || $("app").hidden) {
            return;
        }

        if (b.dataset.v) {
            show(b.dataset.v);
        }

        if (b.dataset.cat) {
            preCat = b.dataset.cat;
            show("search");
        }

        if (b.dataset.lay) {
            lay = b.dataset.lay;

            document.querySelectorAll("[data-lay]").forEach(function (x) {
                x.classList.toggle("on", x.dataset.lay === lay);
            });

            docList($("q").value.toLowerCase());
        }

        if (b.dataset.del) {
            var id = Number(b.dataset.del);
            var d = docs.filter(function (x) {
                return x.id === id;
            })[0];

            if (d && user.role === "admin") {
                docs = docs.filter(function (x) {
                    return x.id !== id;
                });

                logs.push([now(), user.name, "Deleted " + d.t]);
                toast("Demo record deleted.");
                show(cur);
            } else {
                toast("Only Admin can delete documents.");
            }
        }

        if (b.dataset.share) {
            toast("Demo only: sharing is not connected to a backend.");
        }
    });

    $("b1").onclick = function () {
        if (matchMedia("(max-width:860px)").matches) {
            $("app").classList.remove("open");
        } else {
            $("app").classList.add("min");
        }
    };

    $("b2").onclick = function () {
        if (matchMedia("(max-width:860px)").matches) {
            $("app").classList.toggle("open");
        } else {
            $("app").classList.remove("min");
        }
    };

    $("av").onclick = function () {
        show("set");
    };

    $("t1").onclick = function () {
        setMode("in");
    };

    $("t2").onclick = function () {
        setMode("up");
    };

    $("af").addEventListener("submit", function (e) {
        e.preventDefault();

        $("ok").hidden = true;

        if (mode === "in") {
            if (!VAL.si() || !VAL.sp()) {
                return;
            }

            var id = $("si").value.trim().toLowerCase();
            var password = $("sp").value;

            var acc = accounts.filter(function (x) {
                return x.u.toLowerCase() === id ||
                    x.e.toLowerCase() === id;
            })[0];

            /*
             * DEMO ONLY:
             * The username admin selects the Admin role.
             * This does not verify an Admin password.
             */
            if (id === "admin") {
                start({
                    name: "Admin",
                    role: "admin"
                });
            } else if (acc) {
                if (acc.p !== password) {
                    bad("sp", "Incorrect username or password.");
                    return;
                }

                start({
                    name: acc.u,
                    role: "owner"
                });
            } else {
                var selectedRole = $("role").value;

                if (selectedRole === "admin") {
                    start({
                        name: "Admin",
                        role: "admin"
                    });
                } else if (selectedRole === "owner") {
                    start({
                        name: "Priya Nair",
                        role: "owner"
                    });
                } else {
                    start({
                        name: "Marcus Lee",
                        role: "viewer"
                    });
                }
            }
        } else {
            if (
                !VAL.ru() ||
                !VAL.re() ||
                !VAL.rp() ||
                !VAL.rc()
            ) {
                return;
            }

            var u = $("ru").value.trim();

            accounts.push({
                u: u,
                e: $("re").value.trim(),
                p: $("rp").value
            });

            setMode("in");
            $("si").value = u;
            $("ok").textContent =
                "Account created. Sign in to continue.";
            $("ok").hidden = false;
        }
    });

    $("out").onclick = function () {
        logs.push([now(), user.name, "Logged out"]);

        $("app").hidden = true;
        $("login").hidden = false;

        setMode("in");
        toast("Signed out.");
    };

    setMode("in");
})();
