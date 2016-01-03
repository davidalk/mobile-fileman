package uk.co.alkanani.file;

import uk.co.alkanani.json.DirectoryJson;

import java.nio.file.FileSystem;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.util.LinkedList;
import java.util.Queue;

import static java.util.stream.StreamSupport.stream;

public class DirectoryUtil {

    public static DirectoryJson buildDirectoryJsonTree() {
        FileSystem fileSystem = FileSystems.getDefault();
        DirectoryJson root = new DirectoryJson();
        root.name = null;

        Queue<DirectoryNode> pathQueue = new LinkedList<>();

        stream(fileSystem.getRootDirectories().spliterator(), false)
                .map(path -> new DirectoryNode(root, path))
                .forEach(pathQueue::add);

        while (!pathQueue.isEmpty()) {
            DirectoryNode directoryNode = pathQueue.remove();
            DirectoryJson parentDirectoryJson = directoryNode.parentDirectoryJson;
            Path currentDirectoryPath = directoryNode.currentDirectoryPath;

            DirectoryJson newDirectoryJson = new DirectoryJson();
            newDirectoryJson.name = currentDirectoryPath.getFileName().toString();
            parentDirectoryJson.subDirectories.add(newDirectoryJson);



        }
        return root;
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
