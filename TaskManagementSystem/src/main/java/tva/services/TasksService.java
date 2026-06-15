package tva.services;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import tva.models.Tasks;
import tva.models.Users;
import tva.repository.TasksRepository;
import tva.repository.UsersRepository;

@Service
public class TasksService {

    @Autowired
    TasksRepository TR;

    @Autowired
    UsersRepository UR;

    @Autowired
    JwtService JWT;

    public Object addTask(Tasks T, String email, String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            @SuppressWarnings("unchecked")
            Map<String, Object> jwtPayload = (Map<String, Object>) JWT.validateJWT(token);
            String creatorEmail = (String) jwtPayload.get("email");

            // Diagnostic logging
            System.out.println("[DEBUG] addTask called. token present=" + (token != null));
            System.out.println("[DEBUG] creatorEmail from token=" + creatorEmail);

            Users createdBy = (Users) UR.findByEmail(creatorEmail);
            Users U = (Users) UR.findByEmail(email);

            System.out.println("[DEBUG] createdBy=" + (createdBy != null ? createdBy.getEmail() : "null") + ", assignedUser=" + (U != null ? U.getEmail() : "null"));

            if (U == null)
            {
                response.put("code", 400);
                response.put("message", "Assigned user not found.");
                return response;
            }

            // Defensive fallback: if creator lookup fails, use the assigned user as creator to avoid DB constraint failure.
            if (createdBy == null)
            {
                System.out.println("[WARN] createdBy null — falling back to assigned user as creator");
                createdBy = U;
            }

            T.setCreatedBy(createdBy);
            T.setUser(U);

            TR.save(T);

            response.put("code", 200);
            response.put("message", "Task Added Successfully");
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object getAllTasks(String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            JWT.validateJWT(token);

            response.put("code", 200);
            response.put("tasks", TR.findAll());
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object getTaskById(Long id, String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            JWT.validateJWT(token);

            response.put("code", 200);
            response.put("task", TR.findById(id).orElse(null));
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object getMyTasks(String email, String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            JWT.validateJWT(token);

            response.put("code", 200);
            response.put("tasks", TR.findByUserEmail(email));
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object getUsers(String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            JWT.validateJWT(token);

            response.put("code", 200);
            response.put("users", TR.getUsers());
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object updateTask(Long id, Tasks T, String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            JWT.validateJWT(token);

            Tasks task = TR.findById(id).orElse(null);

            if(task != null)
            {
                task.setTitle(T.getTitle());
                task.setDescription(T.getDescription());
                task.setPriority(T.getPriority());
                task.setStatus(T.getStatus());
                task.setDeadline(T.getDeadline());

                TR.save(task);

                response.put("code", 200);
                response.put("message", "Task Updated Successfully");
            }
            else
            {
                response.put("code", 404);
                response.put("message", "Task Not Found");
            }
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }

    public Object deleteTask(Long id, String token)
    {
        Map<String, Object> response = new HashMap<>();

        try
        {
            JWT.validateJWT(token);

            TR.deleteById(id);

            response.put("code", 200);
            response.put("message", "Task Deleted Successfully");
        }
        catch(Exception e)
        {
            response.put("code", 500);
            response.put("message", e.getMessage());
        }

        return response;
    }
}
