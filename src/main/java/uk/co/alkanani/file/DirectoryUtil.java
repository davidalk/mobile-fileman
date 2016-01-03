package uk.co.alkanani.file;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import uk.co.alkanani.json.DirectoryJson;

import java.io.IOException;
import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedList;
import java.util.Queue;

import static java.util.stream.StreamSupport.stream;

public class DirectoryUtil {
    private static final Logger logger = LoggerFactory.getLogger(DirectoryUtil.class);

    public static DirectoryJson buildDirectoryJsonTree() {
        FileSystem fileSystem = FileSystems.getDefault();
        DirectoryJson head = new DirectoryJson();
        head.name = null;

        Queue<DirectoryNode> pathQueue = new LinkedList<>();

        stream(fileSystem.getRootDirectories().spliterator(), false)
                .map(path -> new DirectoryNode(head, path))
                .forEach(pathQueue::add);

        while (!pathQueue.isEmpty()) {
            DirectoryNode directoryNode = pathQueue.remove();
            DirectoryJson parentDirectoryJson = directoryNode.parentDirectoryJson;
            Path currentDirectoryPath = directoryNode.currentDirectoryPath;

            DirectoryJson newDirectoryJson = new DirectoryJson();
            newDirectoryJson.name = currentDirectoryPath.getFileName() == null
                    ? fileSystem.getSeparator() : currentDirectoryPath.getFileName().toString();
            parentDirectoryJson.subDirectories.add(newDirectoryJson);

            try {
                Files.list(currentDirectoryPath)
                        .filter(path -> path.toFile().isDirectory())
                        .map(path -> new DirectoryNode(newDirectoryJson, path))
                        .forEach(pathQueue::add);
            } catch (IOException e) {
                logger.error("Failed to access file list", e);
            }

        }
        return head;
    }

    private static class DirectoryNode {
        public DirectoryJson parentDirectoryJson;
        public Path currentDirectoryPath;

        public DirectoryNode(DirectoryJson parentDirectoryJson, Path currentDirectoryPath) {
            this.parentDirectoryJson = parentDirectoryJson;
            this.currentDirectoryPath = currentDirectoryPath;
        }
    }
}
