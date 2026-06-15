package tva.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import tva.models.Teams;
import tva.services.TeamsService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/team")
public class TeamsController {

    @Autowired
    TeamsService TS;

    @PostMapping("/save")
    public Object saveTeam(@RequestBody Teams team, @RequestHeader("Token") String token) {
        return TS.saveTeam(team, token);
    }

    @PutMapping("/update/{id}")
    public Object updateTeam(@PathVariable Long id, @RequestBody Teams team, @RequestHeader("Token") String token) {
        team.setTeamId(id);
        return TS.saveTeam(team, token);
    }

    @GetMapping("/getall")
    public Object getAllTeams(@RequestHeader("Token") String token) {
        return TS.getAllTeams(token);
    }

    @GetMapping("/view")
    public Object getTeamView(@RequestHeader("Token") String token) {
        return TS.getTeamView(token);
    }

    @GetMapping("/query")
    public Object queryTasks(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) Long teamId,
            @RequestParam(required = false) Integer status,
            @RequestHeader("Token") String token) {
        return TS.queryTasks(q, teamId, status, token);
    }

    @DeleteMapping("/delete/{id}")
    public Object deleteTeam(@PathVariable Long id, @RequestHeader("Token") String token) {
        return TS.deleteTeam(id, token);
    }
}
