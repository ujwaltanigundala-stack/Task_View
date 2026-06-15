package tva.services;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tva.models.Tasks;
import tva.models.Teams;
import tva.models.Users;
import tva.repository.TasksRepository;
import tva.repository.TeamsRepository;
import tva.repository.UsersRepository;

@Service
public class TeamsService {

    @Autowired
    TeamsRepository TR;

    @Autowired
    UsersRepository UR;

    @Autowired
    TasksRepository TaskR;

    @Autowired
    JwtService JWT;

    public Object saveTeam(Teams team, String token) {
        Map<String, Object> response = new HashMap<>();

        try {
            requireManagerOrAdmin(token);

            Teams existing = TR.findByTeamName(team.getTeamName());
            if (existing != null && (team.getTeamId() == null || !existing.getTeamId().equals(team.getTeamId()))) {
                response.put("code", 400);
                response.put("message", "Team name already exists");
                return response;
            }

            TR.save(team);
            response.put("code", 200);
            response.put("message", "Team saved successfully");
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object getAllTeams(String token) {
        Map<String, Object> response = new HashMap<>();

        try {
            requireManagerOrAdmin(token);

            response.put("code", 200);
            response.put("teams", TR.findAll());
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object deleteTeam(Long id, String token) {
        Map<String, Object> response = new HashMap<>();

        try {
            requireManagerOrAdmin(token);

            TR.deleteById(id);
            response.put("code", 200);
            response.put("message", "Team deleted successfully");
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object getTeamView(String token) {
        Map<String, Object> response = new HashMap<>();

        try {
            requireManagerOrAdmin(token);

            List<Map<String, Object>> teamView = TR.findAll().stream().map(team -> {
                List<Users> members = UR.findByTeamId(team.getTeamId());
                List<Tasks> tasks = TaskR.findByTeamId(team.getTeamId());

                Map<String, Object> groupedStatus = new HashMap<>();
                groupedStatus.put("todo", tasks.stream().filter(task -> task.getStatus() == 0).toList());
                groupedStatus.put("inProgress", tasks.stream().filter(task -> task.getStatus() == 1).toList());
                groupedStatus.put("done", tasks.stream().filter(task -> task.getStatus() == 2).toList());

                Map<String, Object> item = new HashMap<>();
                item.put("team", team);
                item.put("members", members);
                item.put("tasks", tasks);
                item.put("statusGroups", groupedStatus);
                return item;
            }).toList();

            response.put("code", 200);
            response.put("teams", teamView);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object queryTasks(String query, Long teamId, Integer status, String token) {
        Map<String, Object> response = new HashMap<>();

        try {
            requireManagerOrAdmin(token);

            List<Tasks> tasks;
            if (query != null && !query.isBlank()) {
                tasks = TaskR.searchTasks(query);
            } else if (teamId != null && status != null) {
                tasks = TaskR.findByTeamIdAndStatus(teamId, status);
            } else if (teamId != null) {
                tasks = TaskR.findByTeamId(teamId);
            } else {
                tasks = TaskR.findAll();
            }

            if (status != null && (query != null && !query.isBlank())) {
                tasks = tasks.stream().filter(task -> task.getStatus() == status).toList();
            }

            if (teamId != null && (query != null && !query.isBlank())) {
                tasks = tasks.stream()
                        .filter(task -> task.getUser() != null
                                && task.getUser().getTeam() != null
                                && teamId.equals(task.getUser().getTeam().getTeamId()))
                        .toList();
            }

            response.put("code", 200);
            response.put("tasks", tasks);
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    @SuppressWarnings("unchecked")
    private void requireManagerOrAdmin(String token) throws Exception {
        Map<String, Object> payload = (Map<String, Object>) JWT.validateJWT(token);
        int role = Integer.parseInt(payload.get("role").toString());

        if (role != 2 && role != 3) {
            throw new Exception("Only Manager or Admin can manage teams.");
        }
    }
}
