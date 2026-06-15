package tva.services;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class AppDataSeeder implements CommandLineRunner {

    private final JdbcTemplate jdbc;

    public AppDataSeeder(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    public void run(String... args) {
        seedRoles();
        seedMenus();
        seedRoleMappings();
        syncSerialSequences();
    }

    private void seedRoles() {
        jdbc.update("""
                insert into roles (role, rolename)
                values (1, 'User')
                on conflict (role) do update set rolename = excluded.rolename
                """);
        jdbc.update("""
                insert into roles (role, rolename)
                values (2, 'Manager')
                on conflict (role) do update set rolename = excluded.rolename
                """);
        jdbc.update("""
                insert into roles (role, rolename)
                values (3, 'Admin')
                on conflict (role) do update set rolename = excluded.rolename
                """);
    }

    private void seedMenus() {
        upsertMenu(2, "My Tasks", "mytask.png");
        upsertMenu(3, "Task Manager", "taskmanager.png");
        upsertMenu(4, "User Manager", "usermanager.png");
        upsertMenu(5, "My Profile", "myprofile.png");
        upsertMenu(6, "Team View", "taskmanager.png");
    }

    private void upsertMenu(int mid, String menu, String icon) {
        jdbc.update("""
                insert into menus (mid, menu, icon)
                values (?, ?, ?)
                on conflict (mid) do update
                set menu = excluded.menu,
                    icon = excluded.icon
                """, mid, menu, icon);
    }

    private void seedRoleMappings() {
        jdbc.update("delete from rolesmapping where role in (1, 2, 3)");

        insertRoleMapping(1, 2);
        insertRoleMapping(1, 5);

        insertRoleMapping(2, 2);
        insertRoleMapping(2, 3);
        insertRoleMapping(2, 5);
        insertRoleMapping(2, 6);

        insertRoleMapping(3, 2);
        insertRoleMapping(3, 3);
        insertRoleMapping(3, 4);
        insertRoleMapping(3, 5);
        insertRoleMapping(3, 6);
    }

    private void insertRoleMapping(int role, int mid) {
        jdbc.update("insert into rolesmapping (role, mid) values (?, ?)", role, mid);
    }

    private void syncSerialSequences() {
        syncSerialSequence("users", "user_id");
        syncSerialSequence("tasks", "task_id");
        syncSerialSequence("teams", "team_id");
        syncSerialSequence("assignments", "assignment_id");
    }

    private void syncSerialSequence(String tableName, String idColumn) {
        jdbc.queryForObject("""
                select setval(
                    pg_get_serial_sequence(?, ?),
                    coalesce((select max(%s) from %s), 0) + 1,
                    false
                )
                """.formatted(idColumn, tableName), Long.class, tableName, idColumn);
    }
}
