package tva.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import tva.models.Tasks;
import tva.services.TasksService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/task")
public class TaskController {

    @Autowired
    TasksService TS;

    @PostMapping("/addtask")
    public Object addTask(
            @RequestBody Map<String, String> data,
            @RequestHeader("Token") String token)
    {

        Tasks T = new Tasks();

        T.setTitle(data.get("title"));
        T.setDescription(data.get("description"));
        T.setPriority(Integer.parseInt(data.get("priority")));
        T.setStatus(Integer.parseInt(data.get("status")));
        T.setDeadline(data.get("deadline"));

        return TS.addTask(T, data.get("email"), token);
    }

    @GetMapping("/getalltasks")
    public Object getAllTasks(
            @RequestHeader("Token") String token)
    {
        return TS.getAllTasks(token);
    }

    @GetMapping("/gettask/{id}")
    public Object getTaskById(
            @PathVariable Long id,
            @RequestHeader("Token") String token)
    {
        return TS.getTaskById(id, token);
    }

    @GetMapping("/getmytasks/{email}")
    public Object getMyTasks(
            @PathVariable String email,
            @RequestHeader("Token") String token)
    {
        return TS.getMyTasks(email, token);
    }

    @GetMapping("/getusers")
    public Object getUsers(
            @RequestHeader("Token") String token)
    {
        return TS.getUsers(token);
    }

    @PutMapping("/updatetask/{id}")
    public Object updateTask(
            @PathVariable Long id,
            @RequestBody Tasks T,
            @RequestHeader("Token") String token)
    {
        return TS.updateTask(id, T, token);
    }

    @DeleteMapping("/deletetask/{id}")
    public Object deleteTask(
            @PathVariable Long id,
            @RequestHeader("Token") String token)
    {
        return TS.deleteTask(id, token);
    }
}
