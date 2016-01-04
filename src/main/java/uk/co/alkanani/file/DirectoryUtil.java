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
import java.util.stream.Stream;

public class DirectoryUtil {
    private static final Logger logger = LoggerFactory.getLogger(DirectoryUtil.class);

    public static DirectoryJson buildDirectoryJsonTree(String start, int depth) {
        FileSystem fileSystem = FileSystems.getDefault();
        DirectoryJson head = new DirectoryJson();
        head.name = null;

        Queue<DirectoryNode> pathQueue = new LinkedList<>();

        Path startPath = fileSystem.getPath(start);
        pathQueue.add(new DirectoryNode(head, startPath));

        while (getPathDepth(startPath, pathQueue.peek().currentDirectoryPath) <= depth) {
            DirectoryNode directoryNode = pathQueue.remove();
            DirectoryJson parentDirectoryJson = directoryNode.parentDirectoryJson;
            Path currentDirectoryPath = directoryNode.currentDirectoryPath;

            DirectoryJson newDirectoryJson = new DirectoryJson();
            newDirectoryJson.name = currentDirectoryPath.getFileName() == null
                    ? fileSystem.getSeparator() : currentDirectoryPath.getFileName().toString();
            parentDirectoryJson.subDirectories.add(newDirectoryJson);


            try (Stream<Path> directoryStream = Files.list(currentDirectoryPath)) {
                directoryStream
                        .filter(path -> Files.isDirectory(path) && Files.isReadable(path) && !isHidden(path))
                        .map(path -> new DirectoryNode(newDirectoryJson, path))
                        .forEach(pathQueue::add);
            } catch (IOException e) {
                logger.error("Failed to access directory stream", e);
            }

        }
        return head;
    }

    public static DirectoryJson buildDirectoryJsonTree() {
        FileSystem fileSystem = FileSystems.getDefault();
        String start = fileSystem.getSeparator();

        return buildDirectoryJsonTree(start, 3);
    }

    public static DirectoryJson buildDirectoryJsonTree(String start) {
        return buildDirectoryJsonTree(start, 3);
    }

    public static DirectoryJson buildDirectoryJsonTree(int depth) {
        FileSystem fileSystem = FileSystems.getDefault();
        String start = fileSystem.getSeparator();

        return buildDirectoryJsonTree(start, depth);
    }

    private static class DirectoryNode {
        public DirectoryJson parentDirectoryJson;
        public Path currentDirectoryPath;

        public DirectoryNode(DirectoryJson parentDirectoryJson, Path currentDirectoryPath) {
            this.parentDirectoryJson = parentDirectoryJson;
            this.currentDirectoryPath = currentDirectoryPath;
        }
    }

    private static boolean isHidden(Path path) {
        try {
            return Files.isHidden(path);
        } catch (IOException e) {
            logger.error("Unable to check for hidden path", e);
            return true;
        }
    }

    private static int getPathDepth(final Path startPath, final Path endPath) {
        int depth = 0;
        Path currentPath = endPath;
        while ( currentPath != null  && !currentPath.equals(startPath)) {
            depth++;
            currentPath = currentPath.getParent();
        }
        return depth;
    }

}
