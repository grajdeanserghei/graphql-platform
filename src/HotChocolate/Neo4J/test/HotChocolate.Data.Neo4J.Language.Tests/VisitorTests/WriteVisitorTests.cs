using Snapshooter.Xunit;
using Xunit;

namespace HotChocolate.Data.Neo4J.Language;

public class WriteVisitorTests
{
    private static readonly Node _movie = Node.Create("Movie")
        .Named("m")
        .WithProperties("Title", Cypher.LiteralOf("The Matrix"));

    private static readonly Pattern _pattern = new (_movie);

    [Fact]
    public void Create()
    {
        var visitor = new CypherVisitor();

        var create = new Create(_pattern);
        create.Visit(visitor);
        visitor.Print().MatchSnapshot();
    }

    [Fact]
    public void Merge()
    {
        var visitor = new CypherVisitor();

        var merge = new Merge(_pattern);
        merge.Visit(visitor);
        visitor.Print().MatchSnapshot();
    }

    [Fact]
    public void Set()
    {
        var visitor = new CypherVisitor();

        var merge = new Set(_pattern);
        merge.Visit(visitor);
        visitor.Print().MatchSnapshot();
    }

    [Fact]
    public void Delete()
    {
        var visitor = new CypherVisitor();

        var merge = new Delete(Expressions.CreateSymbolicNames(_movie.));
        merge.Visit(visitor);
        visitor.Print().MatchSnapshot();
    }

    [Fact]
    public void Remove()
    {
        var visitor = new CypherVisitor();

        var merge = new Remove(_pattern);
        merge.Visit(visitor);
        visitor.Print().MatchSnapshot();
    }
}
