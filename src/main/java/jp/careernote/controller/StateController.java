package jp.careernote.controller;

import java.util.HashMap;
import java.util.Map;
import jp.careernote.model.AppState;
import jp.careernote.service.AppStateService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class StateController {
    private final AppStateService stateService;
    private final ObjectMapper objectMapper;

    public StateController(AppStateService stateService, ObjectMapper objectMapper) {
        this.stateService = stateService;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/state")
    public AppState getState() {
        return stateService.getState();
    }

    @PutMapping("/state")
    public ResponseEntity<?> replaceState(@RequestBody JsonNode payload) {
        if (payload == null || !payload.isObject()
                || !payload.path("profile").isTextual()
                || payload.path("profile").asText().trim().isEmpty()
                || !isArray(payload, "tasks")
                || !isArray(payload, "companies")
                || !isArray(payload, "events")
                || !isArray(payload, "records")
                || !isArray(payload, "templates")) {
            return invalidState();
        }

        AppState state;
        try {
            state = objectMapper.treeToValue(payload, AppState.class);
        } catch (JsonProcessingException exception) {
            return invalidState();
        }
        if (state.tasks.contains(null) || state.companies.contains(null)
                || state.events.contains(null) || state.records.contains(null)
                || state.templates.contains(null)) {
            return invalidState();
        }
        stateService.replaceState(state);
        return ResponseEntity.ok(state);
    }

    private boolean isArray(JsonNode payload, String field) {
        return payload.has(field) && payload.get(field).isArray();
    }

    private ResponseEntity<Map<String, String>> invalidState() {
        Map<String, String> error = new HashMap<>();
        error.put("error", "必要な画面データが不足しているか、形式が正しくありません。");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "ok");
        return response;
    }
}
