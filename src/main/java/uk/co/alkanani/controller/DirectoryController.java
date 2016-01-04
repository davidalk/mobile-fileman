package uk.co.alkanani.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.co.alkanani.file.DirectoryUtil;
import uk.co.alkanani.json.DirectoryJson;

@RestController
@RequestMapping(path = "/directories", produces = "application/json")
public class DirectoryController {

    @RequestMapping(path = "/", method = RequestMethod.GET)
    public DirectoryJson getDirectories(
            @RequestParam(name = "startPath", required = false) String startPath,
            @RequestParam(name = "depth", required = false) String depth) {

        if (startPath != null && depth != null) {
            return DirectoryUtil.buildDirectoryJsonTree(startPath, Integer.valueOf(depth));
        } else if (startPath == null && depth == null) {
            return DirectoryUtil.buildDirectoryJsonTree();
        } else if (depth == null) {
            return DirectoryUtil.buildDirectoryJsonTree(startPath);
        } else {
            return DirectoryUtil.buildDirectoryJsonTree(Integer.valueOf(depth));
        }
    }
}
